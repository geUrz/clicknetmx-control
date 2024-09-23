import { BasicLayout } from '@/layouts'
import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/Home'
import { FaBox, FaBoxes, FaBoxOpen, FaBoxTissue, FaBullhorn, FaCaravan, FaCarCrash, FaClipboard, FaInbox, FaParachuteBox, FaUserCheck, FaUserCog, FaUserMd } from 'react-icons/fa'
import ProtectedRoute from '@/components/Layouts/ProtectedRoute/ProtectedRoute'
import axios from 'axios'
import { size } from 'lodash'
import { Loading, LoadingMini } from '@/components/Layouts'
import { useAuth } from '@/contexts/AuthContext'
import styles from './home.module.css'

export default function Home() {

  const { user, loading } = useAuth()

  const [reload, setReload] = useState(false)

  const onReload = useCallback(() => setReload((prevState) => !prevState), [])

  const [data, setData] = useState({
    incidencias: null,
    anuncios: null,
    visitatecnica: null,
    reportes: null,
    visitaprovedores: null
  });

  const fetchData = useCallback(async (endpoint, key) => {
    try {
      const res = await axios.get(endpoint);
      setData((prevData) => ({
        ...prevData,
        [key]: res.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${key}:`, error)
    }
  }, [])

  useEffect(() => {
    fetchData('/api/incidencias/incidencias', 'incidencias')
    fetchData('/api/anuncios/anuncios', 'anuncios')
    fetchData('/api/visitatecnica/visitatecnica', 'visitatecnica')
    fetchData('/api/reportes/reportes', 'reportes')
    fetchData('/api/visitaprovedores/visitaprovedores', 'visitaprovedores')
  }, [reload])

  const countData = {
    incidencias: size(data.incidencias),
    anuncios: size(data.anuncios),
    visitatecnica: size(data.visitatecnica),
    reportes: size(data.reportes),
    visitaprovedores: size(data.visitaprovedores)
  }

  if (loading) {
    return <Loading size={45} loading={0} />
  }

  return (
    <ProtectedRoute>
      <BasicLayout title='Inicio' onReload={onReload}>
        <div className={styles.main}>
          <div className={styles.section}>
            <Card link='/incidencias' title='Incidencias' 
              countIncidencias={
                !countData.incidencias ? (
                  <LoadingMini />
                ) : (
                  countData.incidencias
                )
              }>
              <FaCarCrash />
            </Card>
            <Card link='/anuncios' title='Anuncios' 
              countAnuncios={
                !countData.anuncios ? (
                  <LoadingMini />
                ) : (
                  countData.anuncios
                )
              }>
              <FaBullhorn />
            </Card>
            <Card link='/visitatecnica' title='Visita Técnica' 
              countVisitatecnica={
                !countData.visitatecnica ? (
                  <LoadingMini />
                ) : (
                  countData.visitatecnica
                )
              }>
              <FaUserCog />
            </Card>
            <Card link='/reportes' title='Reportes' 
              countReportes={
                !countData.reportes ? (
                  <LoadingMini />
                ) : (
                  countData.reportes
                )
              }>
              <FaClipboard />
            </Card>
            <Card link='/visitaprovedores' title='Visita Provedores' 
              countVisitaprovedores={
                !countData.visitaprovedores ? (
                  <LoadingMini />
                ) : (
                  countData.visitaprovedores
                )
              }>
              <FaUserMd />
            </Card>

            {user.isadmin === 'Admin' || user.isadmin === 'Caseta' ? (
              <>

                <Card link='/validarvisitas' title='Validar Visitas' count={false}>
                  <FaUserCheck />
                </Card>

              </>
            ) : (
              ''
            )}

          </div>
        </div>
      </BasicLayout>
    </ProtectedRoute>
  );
}
