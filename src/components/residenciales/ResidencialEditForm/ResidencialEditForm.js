import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { useState } from 'react'
import axios from 'axios'
import { Button, Form, FormField, FormGroup, Input, Label, Message, TextArea } from 'semantic-ui-react'
import { useAuth } from '@/contexts/AuthContext'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './ResidencialEditForm.module.css'

export function ResidencialEditForm(props) {

  const { reload, onReload, usuario, onOpenEditUsuario, onToastSuccessUsuarioMod } = props

  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    direccion: usuario.direccion,
  })

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!formData.nombre) {
      newErrors.nombre = 'El campo es requerido'
    }

    if (!formData.direccion) {
      newErrors.direccion = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // Enviar los datos actualizados
  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    try {
      await axios.put(`/api/residenciales/residenciales?id=${usuario.id}`, {
        ...formData,
        date: formData.date ? formData.date.toISOString().split('T')[0] : null
      })
      onReload()
      onOpenEditUsuario()
      onToastSuccessUsuarioMod()
    } catch (error) {
      console.error('Error actualizando el usuario:', error)
    }
  }

  const opcionesEstado = [
    { key: 1, text: 'Pendiente', value: 'Pendiente' },
    { key: 2, text: 'En proceso', value: 'En proceso' },
    { key: 3, text: 'Realizada', value: 'Realizada' }
  ]


  return (

    <>

      <IconClose onOpenClose={onOpenEditUsuario} />

      <Form>
        <FormGroup widths='equal'>
        <FormField error={!!errors.nombre}>
            <Label>
              Residencial
            </Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <Message negative>{errors.nombre}</Message>}
          </FormField>
          <FormField error={!!errors.direccion}>
            <Label>
              Descripción
            </Label>
            <TextArea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
            {errors.direccion && <Message negative>{errors.direccion}</Message>}
          </FormField>
        </FormGroup>
        <Button primary onClick={handleSubmit}>
          Guardar
        </Button>
      </Form>

    </>

  )
}
