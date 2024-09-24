import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { Form, Button, Input, Label, FormGroup, FormField, Message } from 'semantic-ui-react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import styles from './ModUsuarioForm.module.css'
import { Confirm } from '@/components/Layouts'

export function ModUsuarioForm(props) {

  const { onOpenClose } = props

  const { user, logout } = useAuth()

  const [formData, setFormData] = useState({
    newNombre: user.nombre || '',
    newUsuario: user.usuario || '',
    newEmail: user.email || '',
    newIsAdmin: user.isadmin || '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})

  const validarFormUser = () => {
    const newErrors = {};

    if (!formData.newNombre) {
      newErrors.newNombre = 'El campo es requerido';
    }

    if (!formData.newUsuario) {
      newErrors.newUsuario = 'El campo es requerido';
    }

    if (!formData.newIsAdmin) {
      newErrors.newIsAdmin = 'El campo es requerido';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormUser()) {
      return
    }

    setError(null)

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      await axios.put('/api/auth/updateUser', {
        userId: user.id,
        newNombre: formData.newNombre,
        newUsuario: formData.newUsuario,
        newEmail: formData.newEmail,
        newIsAdmin: formData.newIsAdmin,
        newPassword: formData.newPassword,
      })

      logout()

    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Ocurrió un error inesperado');
      }
    }
  }

  const [activate, setActivate] = useState(false)

  const timer = useRef(null)

  const handleTouchStart = () => {
    timer.current = setTimeout(() => {
      setActivate(prev => !prev)
    }, 3000)
  }

  const handleTouchEnd = () => {
    clearTimeout(timer.current)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === '0') {
      e.preventDefault()
      setActivate((prevState) => !prevState)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>

      <IconClose onOpenClose={onOpenClose} />

      <Form onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <FormGroup widths='equal'>
          <FormField error={!!errors.newNombre}>
            <Label>Nuevo nombre</Label>
            <Input
              name='newNombre'
              type='text'
              value={formData.newNombre}
              onChange={handleChange}
            />
            {errors.newNombre && <Message negative>{errors.newNombre}</Message>}
          </FormField>
          <FormField error={!!errors.newUsuario}>
            <Label>Nuevo usuario</Label>
            <Input
              name='newUsuario'
              type='text'
              value={formData.newUsuario}
              onChange={handleChange}
            />
            {errors.newUsuario && <Message negative>{errors.newUsuario}</Message>}
          </FormField>
          <FormField>
            <Label>Nuevo correo</Label>
            <Input
              name='newEmail'
              type='email'
              value={formData.newEmail}
              onChange={handleChange}
            />
          </FormField>
          
          {activate ? (
            <FormField error={!!errors.newIsAdmin}>
            <Label>
              Nivel
            </Label>
            <FormField
              name='newIsAdmin'
              type="text"
              control='select'
              value={formData.newIsAdmin}
              onChange={handleChange}
            >
              <option value=''></option>
              <option value='Admin'>Admin</option>
              <option value='Comité'>Comité</option>
              <option value='Residente'>Residente</option>
              <option value='Caseta'>Caseta</option>
              <option value='Técnico'>Técnico</option>
            </FormField>
            {errors.newIsAdmin && <Message negative>{errors.newIsAdmin}</Message>}
          </FormField>
          ) : ''}

          <FormField>
            <Label>Nueva contraseña</Label>
            <Input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <Label>Confirmar nueva contraseña</Label>
            <Input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormField>
        </FormGroup>
        {error && <p className={styles.error}>{error}</p>}
        <Button primary onClick={handleSubmit}>Guardar</Button>
      </Form>

    </>

  )
}
