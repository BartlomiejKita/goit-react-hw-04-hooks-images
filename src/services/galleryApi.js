import axios from 'axios';

const fetchPics = async (name, page) => {
  const searchParams = new URLSearchParams({
    key: '28028897-84f3add7f8612b6dc8ccd4fc5',
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 12,
    page,
  });
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const api = { fetchPics };

export default api;
