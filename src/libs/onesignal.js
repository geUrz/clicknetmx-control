export const initializeOneSignal = () => {
  // Obtener los valores desde las cookies
  const userId = getCookie('userId');
  const userName = getCookie('userName');
  const userUsername = getCookie('userUsername');

  if (!userId) {
    console.error('User ID no disponible en las cookies, no se puede inicializar OneSignal.');
    return;
  }

  window.OneSignal = window.OneSignal || [];

  OneSignal.push(function() {
    console.log('Inicializando OneSignal...');

    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
    });

    // Solicitar permiso para notificaciones
    OneSignal.push(() => {
      OneSignal.registerForPushNotifications().then(() => {
        getPlayerIdWithRetry().then((playerId) => {
          console.log('Player ID obtenido:', playerId);

          if (userId) {
            // Enviar Player ID al backend para agregarlo al usuario
            fetch('/api/savePlayerId', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ playerId, userId, userName, userUsername }),
            })
            .then(response => response.json())
            .then(data => {
              console.log('Player ID guardado en el backend:', data.message);
            })
            .catch(error => {
              console.error('Error al enviar Player ID al backend:', error);
            });
          } else {
            console.error('User ID no disponible en las cookies.');
          }
        }).catch((error) => {
          console.error('Error al obtener Player ID:', error);
        });
      }).catch(error => {
        console.error('Error al registrar para notificaciones:', error);
      });
    });

    // Capturar cuando un usuario se suscribe
    OneSignal.on('subscriptionChange', function(isSubscribed) {
      if (isSubscribed) {
        getPlayerIdWithRetry().then((playerId) => {
          if (userId) {
            // Enviar Player ID al backend si cambia la suscripción
            fetch('/api/notificaciones/sendSubscriptionEmail', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ playerId, userId, userName, userUsername }),
            })
            .then(response => response.json())
            .then(data => {
              console.log('Correo de suscripción enviado:', data.message);
            })
            .catch(error => {
              console.error('Error al enviar correo de suscripción:', error);
            });
          } else {
            console.error('User ID no disponible en las cookies.');
          }
        }).catch((error) => {
          console.error('Error al obtener Player ID en subscriptionChange:', error);
        });
      }
    });
  });
};

// Función para obtener el Player ID con más reintentos y mayor tiempo de espera
const getPlayerIdWithRetry = async (retries = 10, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    const playerId = await window.OneSignal.getUserId();
    if (playerId) {
      return playerId; // Si obtienes el playerId, retorna
    }
    await new Promise(res => setTimeout(res, delay)); // Espera antes de reintentar
  }
  throw new Error('Player ID no disponible después de varios intentos');
};

// Función para obtener cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    console.log(`Cookie obtenida: ${name} = ${parts.pop().split(';').shift()}`);
    return parts.pop().split(';').shift();
  }
  console.log(`Cookie ${name} no encontrada`);
};
