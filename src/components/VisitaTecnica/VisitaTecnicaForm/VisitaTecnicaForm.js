import { Button, Form, FormField, FormGroup, Input, Label, TextArea } from 'semantic-ui-react'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { IconClose } from '@/components/Layouts/IconClose/IconClose'
import { genVTId } from '@/helpers'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './VisitaTecnicaForm.module.css'

export function VisitaTecnicaForm(props) {

  const { user } = useAuth()

  const [visitatecnica, setVisitatecnica] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [date, setDate] = useState(null)
  const [hora, setHora] = useState('')

  const { reload, onReload, onOpenCloseForm, onToastSuccessVisitatecnica } = props

  const [errors, setErrors] = useState({})

  const validarForm = () => {
    const newErrors = {}

    if (!visitatecnica) {
      newErrors.visitatecnica = 'El campo es requerido'
    }

    if (!descripcion) {
      newErrors.descripcion = 'El campo es requerido'
    }

    if (!date) {
      newErrors.date = 'El campo es requerido'
    }

    if (!hora) {
      newErrors.hora = 'El campo es requerido'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0

  }

  const handleVisitatecnicaChange = (e) => {
    const value = e.target.value
    setVisitatecnica(value)
  }

  const crearVisitatecnica = async (e) => {

    e.preventDefault()

    if (!validarForm()) {
      return
    }

    const folio = genVTId(4)
    const formattedDate = date ? date.toISOString().split('T')[0] : null
    const estado = 'Pendiente'

    try {
      await axios.post('/api/visitatecnica/visitatecnica', {
        usuario_id: user.id,
        folio,
        visitatecnica,
        descripcion,
        date: formattedDate,
        hora,
        estado
      })

      setVisitatecnica('')
      setDescripcion('')
      setDate(null)
      setHora('')

      onReload()
      onOpenCloseForm()
      onToastSuccessVisitatecnica()

    } catch (error) {
      console.error('Error al crear la visitatecnica:', error)
    }

  }

  return (

    <>

      <IconClose onOpenClose={onOpenCloseForm} />

      <div className={styles.main}>

        <div className={styles.container}>

          <Form>
            <FormGroup widths='equal'>
              <FormField error={!!errors.visitatecnica}>
                <Label>
                  Visita técnica
                </Label>
                <Input
                  name='visitatecnica'
                  type="text"
                  value={visitatecnica}
                  onChange={handleVisitatecnicaChange}
                />
                {errors.visitatecnica && <span className={styles.error}>{errors.visitatecnica}</span>}
              </FormField>
              <FormField error={!!errors.descripcion}>
                <Label>
                  Descripción
                </Label>
                <TextArea
                  name='descripcion'
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
                {errors.descripcion && <span className={styles.error}>{errors.descripcion}</span>}
              </FormField>
              <FormField error={!!errors.date}>
                <Label>
                  Fecha
                </Label>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="dd/mm/aaaa"
                  locale="es"
                  isClearable
                  showPopperArrow={false}
                  popperPlacement="top"
                />
                {errors.date && <span className={styles.error}>{errors.date}</span>}
              </FormField>
              <FormField error={!!errors.hora}>
                <Label>
                  Hora
                </Label>
                <Input
                  name='hora'
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                />
                {errors.hora && <span className={styles.error}>{errors.hora}</span>}
              </FormField>
            </FormGroup>
            <Button
              primary
              onClick={crearVisitatecnica}
            >
              Crear
            </Button>

          </Form>

        </div>

      </div>

    </>

  )
}
