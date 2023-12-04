import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
const Forecast = (props) => {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const city = (data.name)

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`
    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            axios.get(url).then((response) => {
                setData(response.data)
                console.log(response.data)
            })
                .catch(error => {
                    // Handle error
                    if (error.response) {
                        console.log('Response data:', error.response.data);
                        console.log('Response status:', error.response.status);
                        console.log('Response headers:', error.response.headers);
                        if (error.response.data.cod == '404') {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'City Not Found',
                            })
                        }
                    } else if (error.request) {
                        console.log('No response received:', error.request);
                    } else {
                        console.log('Error setting up the request:', error.message);
                    }
                    console.log('Error config:', error.config);
                });

            setLocation('')
        }
    }
    const clouds = (data.weather ? data.weather[0].main : null);
    const iconDay = (data.weather ? data.weather[0].icon : null);
    const icon = `https://openweathermap.org/img/wn/${iconDay}@2x.png`

    let img;
    if (clouds == null) {
        img = <img classNameName="w-full img rounded" src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80" alt="Property Image" />
    } else if (clouds == 'Clouds') {
        img = <img classNameName="w-full img rounded" src="https://images.unsplash.com/photo-1534629938736-b1b076531d3b?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1074" alt="" />
    } else {
        img = <img classNameName="w-full img rounded" src="https://images.unsplash.com/photo-1470432581262-e7880e8fe79a?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1172" alt="" />
    }

    const [ipAddress, setIpAddress] = useState(null);

    useEffect(() => {
        const getIPAddress = async () => {
            try {
                const response = await fetch('http://api.ipapi.com/api/check?access_key=db7b41d2a42692a343a72f7cdb5a339d');
                const datas = await response.json();

                // Ambil alamat IP dari respons JSON
                const userIP = datas.location.capital;
                const latUserIP = datas.latitude;
                const lonUserIP = datas.longitude;

                setIpAddress(userIP);
                if (city == undefined) {
                    const urls = `https://api.openweathermap.org/data/2.5/weather?q=${userIP}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`
                    axios.get(urls).then((response) => {
                        setData(response.data)
                        console.log(response.data)
                    })
                        .catch(error => {
                            // Handle error
                            if (error.response) {
                                console.log('Response data:', error.response.data);
                                console.log('Response status:', error.response.status);
                                console.log('Response headers:', error.response.headers);
                            } else if (error.request) {
                                console.log('No response received:', error.request);
                            } else {
                                console.log('Error setting up the request:', error.message);
                            }
                            console.log('Error config:', error.config);
                        });
                }
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };
        getIPAddress();
    }, []);
    const date = new Date();
    const tanggal = date.getDate()
    const tahun = date.getFullYear()
    const bulan = date.getMonth() + 1
    const timestampRise = (data.sys ? data.sys.sunrise : null);
    const timestampSet = (data.sys ? data.sys.sunset : null);
    const jamsunsets = new Date(timestampSet * 1000);
    const jamsunrises = new Date(timestampRise * 1000);

    // Mendapatkan jam, menit, dan detik
    const jamsunrise = ['0', jamsunrises.getHours(), '.', jamsunrises.getMinutes()]
    const jamsunset = [jamsunsets.getHours(), '.', jamsunsets.getMinutes()]


    //here maps API

    const mapRef = useRef(null);
    const map = useRef(null);
    const platform = useRef(null)
    const { apikey } = props;

    useEffect(
        () => {
            // Check if the map object has already been created
            if (!map.current) {
                // Create a platform object with the API key
                platform.current = new H.service.Platform({ apikey });
                // Create a new Raster Tile service instance

                const rasterTileService = platform.current.getRasterTileService({
                    queryParams: {
                        style: "explore.day",
                        size: 512,
                    },
                });
                // Creates a new instance of the H.service.rasterTile.Provider className
                // The className provides raster tiles for a given tile layer ID and pixel format
                const rasterTileProvider = new H.service.rasterTile.Provider(
                    rasterTileService
                );
                // Create a new Tile layer with the Raster Tile provider
                const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider);
                const latMaps = (data.coord ? data.coord.lat : null)
                const lonMaps = (data.coord ? data.coord.lon : null)
                // Create a new map instance with the Tile layer, center and zoom level
                console.log('ini' + city)

                const newMap = new H.Map(mapRef.current, rasterTileLayer, {
                    pixelRatio: window.devicePixelRatio,
                    center: {
                        lat: -6.232600212097168,
                        lng: 106.90339660644531,
                    },
                    zoom: 14,
                });
                // Add panning and zooming behavior to the map
                const behavior = new H.mapevents.Behavior(
                    new H.mapevents.MapEvents(newMap)
                );

                // Set the map object to the reference
                map.current = newMap;
            }
        },
        // Dependencies array
        [apikey]
    );

    // Return a div element to hold the map
    return (
        <div className="h-full bg-gray-200 p-8">
            <div className="bg-white rounded-lg shadow-xl pb-8">
                <div className="w-full h-[400px]">
                    <div className='w-full h-full rounded-tl-lg rounded-tr-lg' ref={mapRef} />
                </div>
                <div className="flex flex-col items-center -mt-50">

                    <img className='imgIcon w-40 border-4 border-white rounded-full' src={icon} alt="" />
                    <div className="flex items-center space-x-2 mt-2">
                        <h2 className="text-xl font-bold city text-gray-900">{data.name}</h2> {data.sys ? <h2 className='text-3xl font-extrabold leading-3'>{data.sys.country}</h2> : 'tidak ada'}
                    </div>
                    <div className="flex">
                        <div className="">
                            <p>Feels Like</p>
                            {data.main ? <p className="text-lg font-bold text-gray-700">{data.main.feels_like.toFixed()}°F</p> : 'tidak ada'}
                        </div>
                        <div className="ml-4 ">
                            <p>Humidity</p>
                            {data.main ? <p className="text-lg font-bold text-gray-700">{data.main.humidity.toFixed()}%</p> : 'tidak ada'}
                        </div>
                        <div className="ml-4">
                            <p>Wind Speed</p>
                            {data.wind ? <p className="text-lg font-bold ">{data.wind.speed.toFixed()}</p> : 'tidak ada'}
                        </div>

                        <div className="flex clouds">
                            {data.weather ? <p className="text-2xl font-bold text-gray-700" id='clouds'>{data.weather[0].main}</p> : 'tidak ada'}
                        </div>
                    </div>
                    <p className="text-gray-700">Senior Software Engineer at Tailwind CSS</p>
                    <p className="text-sm text-gray-500">New York, USA</p>
                </div>
            </div>

            <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
                <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
                    <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
                    <ul className="mt-2 text-gray-700">
                        <li className="flex border-y py-2">
                            <span className="font-bold w-24">Full name:</span>
                            <span className="text-gray-700">Amanda S. Ross</span>
                        </li>
                        <li className="flex border-b py-2">
                            <span className="font-bold w-24">Birthday:</span>
                            <span className="text-gray-700">24 Jul, 1991</span>
                        </li>
                        <li className="flex border-b py-2">
                            <span className="font-bold w-24">Joined:</span>
                            <span className="text-gray-700">10 Jan 2022 (25 days ago)</span>
                        </li>
                        <li className="flex border-b py-2">
                            <span className="font-bold w-24">Mobile:</span>
                            <span className="text-gray-700">(123) 123-1234</span>
                        </li>
                        <li className="flex border-b py-2">
                            <span className="font-bold w-24">Email:</span>
                            <span className="text-gray-700">amandaross@example.com</span>
                        </li>
                        <li className="flex border-b py-2">
                            <span className="font-bold w-24">Location:</span>
                            <span className="text-gray-700">New York, US</span>
                        </li>
                        <li className="flex border-b py-2">
                            <span className="font-bold w-24">Languages:</span>
                            <span className="text-gray-700">English, Spanish</span>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    )


}

export default Forecast