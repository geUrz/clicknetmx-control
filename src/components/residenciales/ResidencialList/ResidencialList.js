import { ListEmpty, Loading } from '@/components/Layouts'
import { map, size } from 'lodash'
import { FaClipboard } from 'react-icons/fa'
import { BasicModal } from '@/layouts'
import { ReporteDetalles } from '../ResidencialDetalles'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Dropdown, Form, FormField, FormGroup, Label } from 'semantic-ui-react'
import { formatDate, formatDateInc } from '@/helpers'
import { getStatusClass } from '@/helpers/getStatusClass/getStatusClass'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './ResidencialList.module.css'

export function ResidencialList(props) {

  const { reload, onReload, reportes, onToastSuccessReportesMod, onToastSuccessReportesDel } = props

  const { loading } = useAuth()

  const [showDetalles, setShowDetalles] = useState(false)
  const [reporteSeleccionada, setReporteSeleccionada] = useState(null)
  const [showLoading, setShowLoading] = useState(true)

  const onOpenDetalles = (reporte) => {
    setReporteSeleccionada(reporte)
    setShowDetalles(true)
  }

  const onCloseDetalles = () => {
    setReporteSeleccionada(null)
    setShowDetalles(false)
  }

  const [filterEstado, setFilterEstado] = useState('')
  const [filterFecha, setFilterFecha] = useState(null)

  const filteredReporte = (reportes || []).filter((reporte) => {
    return (
      (filterEstado === '' || filterEstado === 'Todas' || reporte.estado === filterEstado) &&
      (filterFecha === null || reporte.date === formatDateInc(filterFecha))
    )
  })

  const opcionesEstado = [
    { key: 1, text: 'Todas', value: 'Todas' },
    { key: 2, text: 'Pendiente', value: 'Pendiente' },
    { key: 3, text: 'En proceso', value: 'En proceso' },
    { key: 4, text: 'Realizada', value: 'Realizada' }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (

    <>

      <div className={styles.filters}>

        <h1>Buscar por:</h1>

        <Form>
          <FormGroup>
          <Label className={styles.label}>Estatus</Label>
            <Dropdown
                placeholder='Todas'
                fluid
                selection
                options={opcionesEstado}
                value={filterEstado}
                onChange={(e, data) => setFilterEstado(data.value)}
              />
            <Label className={styles.label}>Fecha</Label>
            <FormField>
              <DatePicker
                selected={filterFecha}
                onChange={(date) => setFilterFecha(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/aaaa"
                locale="es"
                isClearable
                showPopperArrow={false}
                popperPlacement="bottom"
              />
            </FormField>
          </FormGroup>
        </Form>
      </div>

      {showLoading ? (
        <Loading size={45} loading={2} />
      ) : (
        size(filteredReporte) === 0 ? (
          <ListEmpty />
        ) : (
          <div className={styles.main}>
            {map(filteredReporte, (reporte) => {
              const statusClass = getStatusClass(reporte.estado)

              return (
                <div key={reporte.id} className={styles.section} onClick={() => onOpenDetalles(reporte)}>
                  <div className={`${styles[statusClass]}`}>
                    <div className={styles.column1}>
                      <FaClipboard />
                    </div>
                    <div className={styles.column2}>
                      <div >
                        <h1>Reporte</h1>
                        <h2>{reporte.reporte}</h2>
                      </div>
                      <div >
                        <h1>Fecha</h1>
                        <h2>{formatDate(reporte.date)}</h2>
                      </div>
                      <div >
                        <h1>Estatus</h1>
                        <h2>{reporte.estado}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}

      <BasicModal title='detalles del reporte' show={showDetalles} onClose={onCloseDetalles}>
        {reporteSeleccionada && (
          <ReporteDetalles
            reload={reload}
            onReload={onReload}
            reporte={reporteSeleccionada}
            onOpenCloseDetalles={onCloseDetalles}
            onToastSuccessReportesMod={onToastSuccessReportesMod}
            onToastSuccessReportesDel={onToastSuccessReportesDel}
          />
        )}
      </BasicModal>

    </>

  )
}
