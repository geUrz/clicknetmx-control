import Link from 'next/link'
import styles from './Card.module.css'
import { useEffect, useState } from 'react'
import { LoadingMini } from '@/components/Layouts'

export function Card(props) {

  const {children, title, link, count=true, countIncidencias, countAnuncios, countVisitatecnica, countReportes, countVisitaprovedores} = props

  const [showLoading, setShowLoading] = useState(true)

  const counts = {
    '/incidencias': countIncidencias,
    '/anuncios': countAnuncios,
    '/visitatecnica': countVisitatecnica,
    '/reportes': countReportes,
    '/visitaprovedores': countVisitaprovedores
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 800) 

    return () => clearTimeout(timer)
  }, [])

  return (

    <Link href={`${link}`} className={styles.card}>
      <div>
        {children}
      </div>
      <div>
        {showLoading ? <LoadingMini /> : (count ? <h1>{counts[link] || 0}</h1> : '')}
        <h2>{title}</h2>
      </div>
    </Link>

  )
}
