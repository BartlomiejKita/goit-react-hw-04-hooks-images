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
      // if (totalImages !== totalHits) zapytac!!!!!!!
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

// const INITIAL_STATE = {
//   searchName: '',
//   isLoading: false,
//   gallery: [],
//   error: null,
//   page: 1,
//   totalHits: null,
//   leftHits: null,
//   isModalOpen: false,
//   largeImg: null,
// };

// class App extends Component {
//   state = { ...INITIAL_STATE };

//   async componentDidUpdate(prevProps, prevState) {
//     const prevName = prevState.searchName;
//     const nextName = this.state.searchName;
//     const prevPage = prevState.page;
//     const nextPage = this.state.page;

//     if (prevName !== nextName || prevPage !== nextPage) {
//       this.fetchGallery();
//     }
//   }

//   fetchGallery = async () => {
//     this.setState({ isLoading: true });

//     try {
//       const data = await galleryApi.fetchPics(
//         this.state.searchName,
//         this.state.page
//       );
//       const { hits, totalHits } = data;
//       this.setState(prevState => ({
//         gallery: [...prevState.gallery, ...hits],
//       }));
//       if (totalHits !== this.state.totalHits) {
//         this.setState({ totalHits });
//       }
//       if (totalHits === 0) {
//         toast.warn(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       }
//       if (totalHits > 0 && this.state.page === 1) {
//         toast.success(`Found ${totalHits} images`);
//       }
//       this.state.leftHits = totalHits - this.state.page * 12;
//       if (totalHits !== 0 && this.state.leftHits <= 0) {
//         toast.info(
//           "We're sorry, but you've reached the end of search results."
//         );
//       }
//     } catch (error) {
//       this.setState({ error });
//     } finally {
//       this.setState({ isLoading: false });
//     }
//   };

//   fetchMore = () => {
//     this.setState(({ page }) => ({ page: page + 1 }));
//   };

//   handleFormSubmit = searchName => {
//     if (searchName === this.state.searchName) {
//       return;
//     }
//     this.setState({ searchName, gallery: [], page: 1 });
//   };

//   openModalWindow = event => {
//     if (event.target.nodeName !== 'IMG') {
//       return;
//     }
//     this.setState({
//       largeImg: event.target.dataset.img,
//       isModalOpen: true,
//     });
//   };
//   closeModalWithEsc = event => {
//     if (event.code === 'Escape') {
//       this.setState({ isModalOpen: false });
//     }
//   };

//   closeModal = event => {
//     if (event.target.nodeName === 'IMG') {
//       return;
//     }
//     this.setState({ isModalOpen: false });
//   };

//   render() {
//     if (this.state.isModalOpen) {
//       window.addEventListener('keydown', this.closeModalWithEsc);
//     } else {
//       window.removeEventListener('keydown', this.closeModalWithEsc);
//     }

//     const { gallery, isLoading, error, totalHits, largeImg } = this.state;

//     return (
//       <Wrapper>
//         <Searchbar onSubmit={this.handleFormSubmit} />
//         {error && (
//           <ErrorMsg>Whoops, something went wrong: {error.message}</ErrorMsg>
//         )}
//         {gallery.length > 0 && (
//           <ImageGallery
//             items={gallery}
//             openModalWindow={this.openModalWindow}
//           />
//         )}
//         {isLoading && <Loader />}
//         {gallery.length < totalHits && <LoadMore onClick={this.fetchMore} />}
//         {this.state.isModalOpen && (
//           <Modal closeModal={this.closeModal} item={largeImg} />
//         )}
//         <ToastContainer autoClose={3000} />
//       </Wrapper>
//     );
//   }
// }

export default App;
