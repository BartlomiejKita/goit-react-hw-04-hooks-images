import styled from 'styled-components';
import ImageGalleryItem from './ImageGalleryItem';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';

const GalleryList = styled.ul`
  display: grid;
  max-width: calc(100vw - 48px);
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 16px;
  margin-top: 0;
  margin-bottom: 0;
  padding: 0;
  list-style: none;
  margin-left: auto;
  margin-right: auto;
`;

const ImageGallery = ({ items, openModalWindow }) => {
  return (
    <GalleryList onClick={openModalWindow}>
      {items.map(({ webformatURL, tags, largeImageURL }) => (
        <ImageGalleryItem
          key={nanoid()}
          src={webformatURL}
          alt={tags}
          largeSrc={largeImageURL}
        />
      ))}
    </GalleryList>
  );
};

ImageGallery.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  openModalWindow: PropTypes.func.isRequired,
};

export default ImageGallery;
