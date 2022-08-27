import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import React, { Component } from 'react';
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

const INITIAL_STATE = {
  searchName: '',
  isLoading: false,
  gallery: [],
  error: null,
  page: 1,
  totalHits: null,
  leftHits: null,
  isModalOpen: false,
  largeImg: null,
};

export default class App extends Component {
  state = { ...INITIAL_STATE };

  async componentDidUpdate(prevProps, prevState) {
    const prevName = prevState.searchName;
    const nextName = this.state.searchName;
    const prevPage = prevState.page;
    const nextPage = this.state.page;

    if (prevName !== nextName || prevPage !== nextPage) {
      this.fetchGallery();
    }
  }

  fetchGallery = async () => {
    this.setState({ isLoading: true });

    try {
      const data = await galleryApi.fetchPics(
        this.state.searchName,
        this.state.page
      );
      const { hits, totalHits } = data;
      this.setState(prevState => ({
        gallery: [...prevState.gallery, ...hits],
      }));
      if (totalHits !== this.state.totalHits) {
        this.setState({ totalHits });
      }
      if (totalHits === 0) {
        toast.warn(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (totalHits > 0 && this.state.page === 1) {
        toast.success(`Found ${totalHits} images`);
      }
      this.state.leftHits = totalHits - this.state.page * 12;
      if (totalHits !== 0 && this.state.leftHits <= 0) {
        toast.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  handleFormSubmit = searchName => {
    if (searchName === this.state.searchName) {
      return;
    }
    this.setState({ searchName, gallery: [], page: 1 });
  };

  openModalWindow = event => {
    if (event.target.nodeName !== 'IMG') {
      return;
    }
    this.setState({
      largeImg: event.target.dataset.img,
      isModalOpen: true,
    });
  };
  closeModalWithEsc = event => {
    if (event.code === 'Escape') {
      this.setState({ isModalOpen: false });
    }
  };

  closeModal = event => {
    if (event.target.nodeName === 'IMG') {
      return;
    }
    this.setState({ isModalOpen: false });
  };

  render() {
    if (this.state.isModalOpen) {
      window.addEventListener('keydown', this.closeModalWithEsc);
    } else {
      window.removeEventListener('keydown', this.closeModalWithEsc);
    }

    const { gallery, isLoading, error, totalHits, largeImg } = this.state;

    return (
      <Wrapper>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {error && (
          <ErrorMsg>Whoops, something went wrong: {error.message}</ErrorMsg>
        )}
        {gallery.length > 0 && (
          <ImageGallery
            items={gallery}
            openModalWindow={this.openModalWindow}
          />
        )}
        {isLoading && <Loader />}
        {gallery.length < totalHits && <LoadMore onClick={this.fetchMore} />}
        {this.state.isModalOpen && (
          <Modal closeModal={this.closeModal} item={largeImg} />
        )}
        <ToastContainer autoClose={3000} />
      </Wrapper>
    );
  }
}
