import { Button, Form, FormField, FormGroup, Input, Label, Message } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { FaUserPlus } from 'react-icons/fa'
import Link from 'next/link'
import { useRedirectIfAuthenticated } from '@/hooks'
import { BasicJoin } from '@/layouts'
import styles from './signup.module.css'

export default function Signup() {

  const router = useRouter()

  const [errors, setErrors] = useState({})

  const [credentials, setCredentials] = useState({
    nombre: '',
    usuario: '',
    privada: '',
    calle: '',
    casa: '',
    email: '',
    isadmin: '',
    password: '',
    confirmarPassword: ''
  })

  useRedirectIfAuthenticated()

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const validarFormSignUp = () => {
    const newErrors = {}

    if (!credentials.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!credentials.usuario) {
      newErrors.usuario = 'El campo es requerido'
    }

    if (!credentials.email) {
      newErrors.email = 'El campo es requerido'
    }

    if (!credentials.isadmin) {
      newErrors.isadmin = 'El campo es requerido'
    }

    if (!credentials.password) {
      newErrors.password = 'El campo es requerido'
    }

    if (!credentials.confirmarPassword) {
      newErrors.confirmarPassword = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormSignUp()) {
      return
    }
    setError(null)

    if (credentials.password !== credentials.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await axios.post('/api/auth/register', credentials)

      router.push('/join/signin')

      setCredentials({
        nombre: '',
        usuario: '',
        privada: '',
        calle: '',
        casa: '',
        email: '',
        isadmin: '',
        password: '',
        confirmarPassword: ''
      })

      setError(null)
    } catch (error) {
      console.error('Error capturado:', error);

      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Error específico del backend
      } else if (error.message) {
        setError(error.message); // Error general de JS (por ejemplo, error de red)
      } else {
        setError('¡ Ocurrió un error inesperado !'); // Fallback para cualquier otro tipo de error
      }
    }
  };

  return (

    <BasicJoin relative>

      <div className={styles.main}>

        <div className={styles.boxForm}>

          <div className={styles.user}>
            <div>
              <FaUserPlus />
            </div>
            <h1>Crear usuario</h1>
          </div>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <FormField error={!!errors.nombre}>
                <Label>Nombre</Label>
                <Input
                  name='nombre'
                  type='text'
                  value={credentials.nombre}
                  onChange={handleChange}
                />
                {errors.nombre && <Message negative>{errors.nombre}</Message>}
              </FormField>
              <FormField error={!!errors.usuario}>
                <Label>Usuario</Label>
                <Input
                  name='usuario'
                  type='text'
                  value={credentials.usuario}
                  onChange={handleChange}
                />
                {errors.usuario && <Message negative>{errors.usuario}</Message>}
              </FormField>
              <FormField>
                <Label>
                  Privada
                </Label>
                <Input
                  name='privada'
                  type="text"
                  value={credentials.privada}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Label>
                  Calle
                </Label>
                <Input
                  name='calle'
                  type="text"
                  value={credentials.calle}
                  onChange={handleChange}
                />
              </FormField>
              <FormField>
                <Label>Casa</Label>
                <Input
                  name='casa'
                  type='number'
                  value={credentials.casa}
                  onChange={handleChange}
                />
              </FormField>
              <FormField error={!!errors.email}>
                <Label>Correo</Label>
                <Input
                  name='email'
                  type='email'
                  value={credentials.email}
                  onChange={handleChange}
                />
                {errors.email && <Message negative>{errors.email}</Message>}
              </FormField>
              <FormField error={!!errors.isadmin}>
                <Label>
                  Nivel
                </Label>
                <FormField
                  name='isadmin'
                  type="text"
                  control='select'
                  value={credentials.isadmin}
                  onChange={handleChange}
                >
                  <option value=''></option>
                  <option value='Admin'>Admin</option>
                  <option value='Comité'>Comité</option>
                  <option value='Residente'>Residente</option>
                  <option value='Caseta'>Caseta</option>
                  <option value='Técnico'>Técnico</option>
                </FormField>
                {errors.isadmin && <Message negative>{errors.isadmin}</Message>}
              </FormField>
              <FormField error={!!errors.password}>
                <Label>Contraseña</Label>
                <Input
                  name='password'
                  type='password'
                  value={credentials.password}
                  onChange={handleChange}
                />
                {errors.password && <Message negative>{errors.password}</Message>}
              </FormField>
              <FormField error={!!errors.confirmarPassword}>
                <Label>Confirmar contraseña</Label>
                <Input
                  name='confirmarPassword'
                  type='password'
                  value={credentials.confirmarPassword}
                  onChange={handleChange}
                />
                {errors.confirmarPassword && <Message negative>{errors.confirmarPassword}</Message>}
              </FormField>
            </FormGroup>
            {error && <p className={styles.error}>{error}</p>}
            <Button primary type='submit'>
              Crear
            </Button>
          </Form>

          <div className={styles.link}>
            <Link href='/join/signin'>
              Iniciar sesión
            </Link>
          </div>

        </div>

      </div>

    </BasicJoin>

  )
}
