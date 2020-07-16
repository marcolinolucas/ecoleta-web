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
		const { data } = await API.post('/points', point);
		return data.name;
  } catch (err) {
		console.error(err)
		throw new Error(err.response.data)
  }
}

export {
  getCollectItems,
  createPoint,
};
