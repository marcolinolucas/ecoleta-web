import React, {
  useState, useEffect, ChangeEvent, FormEvent
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import './styles.css';

import logo from '../../assets/logo.svg';

import Dropzone from '../../components/Dropzone';
import ValidationMessage from '../../components/ValidationMessage';

import { getCollectItems, createPoint } from '../../services/EcoletaService';
import { getUFs, getCitiesUF } from '../../services/IBGEService';

import { isValidPhone, isValidEmail } from '../../helpers/stringHelper';

interface Item {
  id: number,
  title: string,
  imageUrl: string,
}

const CreatePoint = () => {
  const [validPointForm, setValidPointForm] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const history = useHistory();

  useEffect(() => navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    setInitialPosition([latitude, longitude]);
  }), []);

  useEffect(() => {
    async function getCollectItemsAsync() {
      setItems(await getCollectItems());
    }

    getCollectItemsAsync();
  }, []);

  useEffect(() => {
    async function getUFsAsync() {
      setUfs(await getUFs());
    }

    getUFsAsync();
  }, []);

  useEffect(() => {
    if (selectedUf === '0') return;

    async function getCitiesUFAsync() {
      setCities(await getCitiesUF(selectedUf));
    }

    getCitiesUFAsync();
	}, [selectedUf]);
	
	useEffect(() => {
		setValidPointForm(!!selectedFile
			&& formData.name.length >= 4
			&& isValidEmail(formData.email)
			&& isValidPhone(formData.whatsapp)
			&& selectedPosition[0] !== 0 && selectedPosition[1] !== 0
			&& selectedCity !== '0'
			&& selectedUf !== '0'
			&& selectedItems.length !== 0
		)
	}, [
		selectedUf,
		selectedCity,
		selectedPosition,
		selectedItems,
		selectedFile,
		formData
	])

  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    return setSelectedUf(event.target.value);
  }

  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    return setSelectedCity(event.target.value);
  }

  function handleSelectedPosition(event: LeafletMouseEvent) {
    return setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex((item) => item === id) >= 0;

    if (alreadySelected) {
      const itemsFiltered = selectedItems.filter((item) => item !== id);
      return setSelectedItems(itemsFiltered);
    }
    return setSelectedItems([...selectedItems, id]);
  }

  function handleFormData(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    return setFormData({ ...formData, [name]: value });
	}
	
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const [latitude, longitude] = selectedPosition;
    const city = selectedCity;
    const uf = selectedUf;
    const image = selectedFile;

    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('city', city);
    data.append('uf', uf);
    data.append('items', selectedItems.join(','));

    if (image) {
      data.append('image', image);
    }

    await createPoint(data);

    alert('Ponto de coleta criado!');

    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do
          <br />
          {' '}
          ponto de coleta
        </h1>
 
				<div className="wrapper-dropzone">
					<ValidationMessage
						valid={!!selectedFile}
						message="Selecione uma imagem"
					/>
					<Dropzone onFileUploaded={setSelectedFile} />
				</div>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
						<ValidationMessage
							valid={formData.name.length >= 4}
							message="Nome deve conter pelo menos 4 caracteres"
						/> 
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleFormData}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
							<ValidationMessage
								valid={isValidEmail(formData.email)}
								message="Email deve ser válido"
							/> 
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleFormData}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
							<ValidationMessage
								valid={isValidPhone(formData.whatsapp)}
								message="Whatsapp deve ser um número válido"
							/> 
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                onChange={handleFormData}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
					<ValidationMessage
						valid={selectedPosition[0] !== 0 && selectedPosition[1] !== 0}
						message="Escolha um ponto no mapa"
					/>
          <Map center={initialPosition} zoom={15} onClick={handleSelectedPosition}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
							<ValidationMessage
								valid={selectedUf !== '0'}
								message="Selecione uma UF"
							/>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectedUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
							<ValidationMessage
								valid={selectedCity !== '0'}
								message="Selecione uma cidade"
							/>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}
              > 
                <option value="0">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
					<ValidationMessage
						valid={selectedItems.length !== 0}
						message="Selecione pelo menos um item"
					/>
          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectedItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.imageUrl} alt={item.title}	 />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit" disabled={!validPointForm}>Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
