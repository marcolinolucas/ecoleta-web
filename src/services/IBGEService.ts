import axios from 'axios';

const API = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
});

interface IBGEUFResponse {
  sigla: string,
}

interface IBGEUFCityResponse {
  nome: string,
}

async function getUFs() {
  try {
    const res = await API.get<IBGEUFResponse[]>('/estados');
    if (!res.data) return [];
    const ufs = res.data.map((uf) => uf.sigla);
    return ufs;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getCitiesUF(uf: string) {
  try {
    const res = await API.get<IBGEUFCityResponse[]>(`/estados/${uf}/municipios`);
    if (!res.data) return [];
    const cities = res.data.map((city) => city.nome);
    return cities;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export {
  getUFs,
  getCitiesUF,
};
