import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import { useState, useEffect, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import styled from 'styled-components';
import galleryApi from 'services/galleryApi';
import LoadMore from './LoadMore';
import { toast } from 'react-toastify';
import Modal from './Modal';
import Loader from './Loader';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 16px;
  padding-bottom: 24px;
`;

const ErrorMsg = styled.p`
  display: flex;
  justify-content: center;
  font-weight: bold;
  font-size: 19px;
`;

const App = () => {
  const [searchName, setSearchName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalHits, setTotalHits] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [largeImg, setLargeImg] = useState(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);

    try {
      if (!searchName) {
        return;
      }
      const data = await galleryApi.fetchPics(searchName, page);
      const { hits: newImages, totalHits: totalImages } = data;
      setGallery(gallery => [...gallery, ...newImages]);
      setTotalHits(totalImages);

      if (totalImages === 0) {
        toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (totalImages > 0 && page === 1) {
        toast.success(`Found ${totalImages} images`);
      }

      if (totalImages !== 0 && totalImages - page * 12 <= 0) {
        toast.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [searchName, page]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const fetchMore = () => {
    setPage(page + 1);
  };

  const handleFormSubmit = query => {
    if (query === searchName) {
      toast.info(
        `You have already looked for ${query}. Please type something else!!!`
      );
      return;
    }
    setSearchName(query);
    setGallery([]);
    setPage(1);
  };

  const openModalWindow = event => {
    if (event.target.nodeName !== 'IMG') {
      return;
    }
    setLargeImg(event.target.dataset.img);
    setIsModalOpen(true);
  };

  const closeModalWithEsc = event => {
    if (event.code === 'Escape') {
      setIsModalOpen(false);
    }
  };

  const closeModal = event => {
    if (event.target.nodeName === 'IMG') {
      return;
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('keydown', closeModalWithEsc);
    } else {
      window.removeEventListener('keydown', closeModalWithEsc);
    }
  }, [isModalOpen]);

  return (
    <Wrapper>
      <Searchbar onSubmit={handleFormSubmit} />
      {error && (
        <ErrorMsg>Whoops, something went wrong: {error.message}</ErrorMsg>
      )}
      {gallery.length > 0 && (
        <ImageGallery items={gallery} openModalWindow={openModalWindow} />
      )}
      {isLoading && <Loader />}
      {gallery.length < totalHits && <LoadMore onClick={fetchMore} />}
      {isModalOpen && <Modal closeModal={closeModal} item={largeImg} />}
      <ToastContainer autoClose={3000} />
    </Wrapper>
  );
};

export default App;
