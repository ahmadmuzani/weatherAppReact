import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import H from '@here/maps-api-for-javascript'

const WeatherNow = ({ apiKey }) => {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const city = (data.name)

    const [dataF, setDataF] = useState({})
    // const map = useRef(null);
    // const platform = useRef(null)
    // const { apikey } = props;
    // const [lat, setLat] = useState(51.505);
    // const [lon, setLon] = useState(-0.09);
    const mapRef = useRef(null)
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=0f29abb8a847e439f9d265d51dbcb350`
    // axios.get(url).then((response) => {
    //     setData(response.data)
    // })

    const searchLocation = (event) => {
        const latMaps = (data.coord ? data.coord.lat : null)
        const lonMaps = (data.coord ? data.coord.lon : null)
        if (event.key === 'Enter') {
            let cleanUp = false;
            if (!cleanUp) {
                const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${latMaps}&lon=${lonMaps}&appid=a4eb5a83d98de3a29acfe49eb1b8c27a`
                axios.get(urlForecast).then((response) => {
                    setDataF(response.data)
                    console.log(response.data)
                })
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=a4eb5a83d98de3a29acfe49eb1b8c27a`
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
            }
            setLocation('')
            return () => {
                cleanUp = true
            };
        }
    }
    const clouds = (data.weather ? data.weather[0].main : null);
    const iconDay = (data.weather ? data.weather[0].icon : null);
    const icon = `https://openweathermap.org/img/wn/${iconDay}@2x.png`

    let img;
    if (clouds == null) {
        img = <img style={{ width: "100%", height: "400px" }} className="w-full img rounded" src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZXJuJTIwaG91c2V8ZW58MHx8MHx8&w=1000&q=80" alt="Property Image" />
    } else if (clouds == 'Clouds') {
        img = <img style={{ width: "100%", height: "400px" }} className="w-full img rounded" src="https://images.unsplash.com/photo-1593978301851-40c1849d47d4?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
    } else if (clouds == 'Haze') {
        img = <img style={{ width: "100%", height: "400px" }} className="w-full img rounded" src="https://images.unsplash.com/36/STzPBJUsSza3mzUxiplj_DSC09775.JPG?q=80&w=2061&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
    } else {
        img = <img style={{ width: "100%", height: "400px" }} className="w-full img rounded" src="https://images.unsplash.com/photo-1470432581262-e7880e8fe79a?auto=format&fit=crop&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=1172" alt="" />
    }
    const [ipAddress, setIpAddress] = useState(null);

    useEffect(() => {
        const getIPAddress = async () => {
            try {
                const responseIP = await fetch('https://api64.ipify.org/?format=json');
                const numberIP = await responseIP.json();
                const ip = numberIP.ip;
                const response = await fetch(`http://ip-api.com/json/${ip}`);
                const dataIP = await response.json();

                // Ambil alamat IP dari respons JSON
                const userIP = dataIP.city;
                // const latUserIP = datas.latitude;
                // const lonUserIP = datas.longitude;

                setIpAddress(userIP);
                let cleanUp;
                if (!cleanUp) {


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

    const kota = city;
    const [latIpAddress, setLatIpAddress] = useState('');
    const [lonIpAddress, setLonIpAddress] = useState('');
    useEffect(() => {

    }, [apiKey])

    return (
        <div className="App">
            <div className="max-w-xl mx-auto rounded overflow-hidden shadow-lg hover:shadow-xl">
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
                <div className="relative">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input value={location}
                        onChange={event => setLocation(event.target.value)}
                        onKeyPress={searchLocation} type="text" className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search City" required />
                </div>

                <div>{img}</div>

                <div className="px-6 py-4">

                    <div className="flex op">
                        <span className='date'>{tanggal}-{bulan}-{tahun}</span>
                    </div>
                    <div className="flex">
                        <h2 className="text-xl font-bold city text-gray-900">{data.name}</h2> {data.sys ? <h2 className='text-3xl font-extrabold leading-3'>{data.sys.country}</h2> : 'tidak ada'}
                        <img className='imgIcon' src={icon} alt="" />
                    </div>
                    <div className="flex clouds">
                        {data.weather ? <p className="text-2xl font-bold text-gray-700" id='clouds'>{data.weather[0].main}</p> : 'tidak ada'}
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
                        <div className="ml-4">
                            <p>Sunrise</p>
                            <p className="text-lg font-bold ">{jamsunrise}</p>
                        </div>
                        <div className="ml-4">
                            <p>Sunset</p>
                            <p className="text-lg font-bold ">{jamsunset}</p>
                        </div>


                    </div>
                    <div className="temp">
                        <p className="text- font-bold text-gray-900">Temprature</p>
                    </div>
                    <div className="flex">
                        {data.main ? <h1 className="text-5xl font-extrabold pr-6">{data.main.temp.toFixed()} °F</h1> : 'tidak ada'}
                        {data.main ? <h1 className="text-5xl font-extrabold">{Math.round((data.main.temp - 32) / 1.8)} °C</h1> : 'tidak ada'}
                    </div>
                    {/* <Forecast data={data} /> */}
                </div>
            </div>
        </div>
    )
}

export default WeatherNow
// const Forecast = ({ data }) => {
//     const latMaps = (data.coord ? data.coord.lat : null)
//     const lonMaps = (data.coord ? data.coord.lon : null)


//     return (
//         <div className='mt-5'>
//             <h2 className='text font-bold text-gray-900'>Forecast</h2>
//             <div className="flex">
//                 <div className="">
//                     <p></p>
//                 </div>
//                 <div className="ml-4 ">
//                     <p>Humidity</p>
//                 </div>
//                 <div className="ml-4">
//                     <p>Wind Speed</p>
//                 </div>
//                 <div className="ml-4">
//                     <p>Sunrise</p>
//                 </div>
//                 <div className="ml-4">
//                     <p>Sunset</p>
//                 </div>


//             </div>
//         </div>
//     )
// }

// var timestampNow = Math.floor(Date.now() / 1000);

// // Buat objek Date dengan menggunakan timestamp
// var date = new Date(timestampNow * 1000); // Kali 1000 karena timestamp umumnya dalam detik, tetapi Date menggunakan milidetik

// // Dapatkan informasi tanggal
// var year = date.getFullYear();
// var month = date.getMonth() + 1; // Perlu ditambah 1 karena bulan dimulai dari 0
// var day = date.getDate();
// const tanggal = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
// let dateObject = new Date(tanggal);
// const dayOfWeek = dateObject.toLocaleDateString('en-US', { weekday: 'long' });
// console.log(dayOfWeek)