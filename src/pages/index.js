import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'

import Layout from '@components/Layout';
import Container from '@components/Container';
import Modal from '@components/Model';
import Button from '@components/Button';
import { motion } from 'framer-motion';
import { useRouter } from "next/router";

import { search, mapImageResources } from '../lib/cloudinary';

import styles from '@styles/Home.module.scss'


export default function Home({ imageSrc: defaultImageSrc, uploadData: defaultUploadData, images: defaultImages, nextCursor: defaultNextCursor }) {
  const [imageSrc, setImageSrc] = useState(defaultImageSrc);
  const [uploadData, setUploadData] = useState(defaultUploadData);
  const [images, setImages] = useState(defaultImages);
  const [selectedImg, setSelectedImg] = useState(null);
  const [nextCursor, setNextCursor] = useState(defaultNextCursor);
  const router = useRouter();

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');

    const formData = new FormData(window.location.reload());

    for (const file of fileInput.files) {
      formData.append('file', file);
    }

    formData.append('upload_preset', 'weddingupload');

    const data = await fetch('https://api.cloudinary.com/v1_1/dw8s775hb/image/upload', {
      method: 'POST',
      body: formData
    }).then(r => r.json());

    setImageSrc(data.secure_url);
    setUploadData(data);
  }

  async function handleOnLoadMore(e) {
    e.preventDefault();

    const results = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        nextCursor
      })
    }).then(r => r.json());

    const { resources, next_cursor: updatedNextCursor } = results;

    const images =
      mapImageResources(resources);

    setImages(prev => {
      return [
        ...prev,
        ...images
      ]
    });
    setNextCursor(updatedNextCursor);
    setSelectedImg(selectedImg);

  }

  return (
    <Layout>
      <Container>
        <h1 className="sr-only">My Images</h1>

        <div className={styles.container}>
          <Head>
            <title>wedding images</title>
            <meta name="description" content="Upload your image to Cloudinary!" />
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/manifest.json" />
          </Head>

          <main className={styles.main}>
            <h1 className={styles.title}>
              Wedding Images
            </h1>

            <form className={styles.form} method="post" onChange={handleOnChange} onSubmit={handleOnSubmit} >
              <p>
                <input type="file" multiple name="file" />
              </p>

              <img src={imageSrc} />

              {imageSrc && !uploadData && (
                <p>
                  <button>Upload Images</button>
                </p>
              )}
            </form>
          </main>
        </div>

        <motion.ul className={styles.images}>
          {images.map(image => {
            return (
              <motion.li className={styles.imgwrap} key={image.id} onClick={() => setSelectedImg(image.image)} layout
                whileHover={{ opacity: 2.5 }}>
                <a href={image.link} rel="noreferrer">
                  <motion.div className={styles.imageImage} initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}>
                    <Image height="500" width="500" src={image.image} alt="image" />
                  </motion.div>
                </a>
              </motion.li>

            )
          })}
        </motion.ul>
        {selectedImg && <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg}></Modal>}
        <p>
          <Button onClick={handleOnLoadMore}>Load More Images...</Button>
        </p>
      </Container>
    </Layout>
  )
  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    }

    reader.readAsDataURL(changeEvent.target.files[0]);
  }
}


export async function getStaticProps() {
  const results = await search();

  const { resources, next_cursor: nextCursor } = results;

  const images = mapImageResources(resources);
  return {
    props: {
      images,
      nextCursor
    }
  }
}

