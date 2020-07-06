import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3333',
});

interface FormData {
  append(name: string, value: string, blobName?: string): void;
}

async function getCollectItems() {
  try {
    const { data } = await API.get('/items');
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function createPoint(point: FormData) {
  try {
    await API.post('/points', point);
  } catch (err) {
    console.error(err);
  }
}

export {
  getCollectItems,
  createPoint,
};
