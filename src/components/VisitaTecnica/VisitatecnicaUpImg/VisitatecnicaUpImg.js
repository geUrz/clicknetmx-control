import { Button, Form, FormField, FormGroup, Image, Message } from 'semantic-ui-react';
import { useState } from 'react';
import { IconClose } from '@/components/Layouts';
import axios from 'axios';
import styles from './VisitatecnicaUpImg.module.css';

export function VisitatecnicaUpImg(props) {

  const { reload, onReload, visitatecnica, onShowSubirImg, selectedImageKey } = props

  const [fileName, setFileName] = useState('No se ha seleccionado ningún archivo')
  const [selectedImage, setSelectedImage] = useState(null)
  const [error, setError] = useState('')
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 2 * 1000 * 1500

  const handleImageSelect = (e) => {
    
    const file = e.target.files[0]
    if (!file) return;

    setFileName(file.name)

    if (!acceptedTypes.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG y WEBP.')
      return;
    }

    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. El tamaño máximo permitido es 2 MB.')
      return;
    }

    setError('')
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)
  };

  const handleImageUpload = async () => {
    const file = document.querySelector('input[type="file"]').files[0]
    if (!file) return;

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'clicknetmxcontrol') // Cloudinary preset

    try {
      const res = await axios.post('https://api.cloudinary.com/v1_1/dwi6j5wmy/image/upload', formData) // Cloudinary URL
      const imageUrl = res.data.secure_url;

      // Crear el objeto dinámicamente con la imagen seleccionada (img1, img2, etc.)
      const updatedImage = { [selectedImageKey]: imageUrl };

      await axios.put(`/api/visitatecnica/updateImage?id=${visitatecnica.id}`, updatedImage)

      setError('')
      onReload()
      onShowSubirImg()
    } catch (error) {
      setError('Error al subir la imagen. Inténtalo de nuevo.')
      console.error('Error al subir la imagen:', error)
    }
  };

  return (
    <>
      <IconClose onOpenClose={onShowSubirImg} />
      <div className={styles.main}>
        <div className={styles.img}>
          {selectedImage ? <Image src={selectedImage} width="200px" height="200px" /> : ''}
        </div>
        <Form>
          <FormGroup widths="equal">
            <FormField>
              <label htmlFor="file" className="ui icon button">
                <Button as="span" primary>
                  {!selectedImage ? 'Seleccionar imagen' : 'Cambiar imagen'}
                </Button>
              </label>
              <input
                id="file"
                type="file"
                hidden
                onChange={handleImageSelect}
              />
              <span>{fileName}</span>
              {error && <Message negative>{error}</Message>}
              <h1>Formatos: png, jpg y webp</h1>
              <Button onClick={handleImageUpload} secondary disabled={!selectedImage}>
                Subir Imagen
              </Button>
            </FormField>
          </FormGroup>
        </Form>
      </div>
    </>
  )
}
