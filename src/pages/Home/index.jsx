import { useEffect, useMemo, useRef, useState } from 'react';
import ContentGroup from '../../components/ContentGroup';
import './styles.css';

const Home = () => {
    const [ quotes, setQuotes ] = useState([{ content:"", author:""}]);
    const [ index, setIndex ] = useState(0);
    const [ location, setLocation ] = useState({
        city: "",
        country_code: "",
        country_name: "",
        ip: "",
        latitude: 0,
        longitude: 0,
        metro_code: 0,
        region_code: "",
        region_name: "",
        time_zone: "Africa/Maputo",
        zip_code: ""
    });
    const [ currentTime, setCurrentTime ] = useState({
        "abbreviation":"",
        "day_of_week":0,
        "day_of_year":0,
        "date": "",
        "datetime":"",
        "week_number":0,
        "timezone":""
    });

    const quoteRef = useRef(null);
    const quoteAuthorRef = useRef(null);
    const homeRef = useRef(null);
    const homeLocationRef = useRef(null);
    const homeIntroRef = useRef(null);
    const homeMoreButtonIcon = useRef(null);
    //const homeGreetingIconRef = useRef(null);

    /*const memorizedValue = useMemo(() => {
        return quotes[index].author;
    }, [ index, quotes ]);

    const memorizedDescription = useMemo(() => {
        return quotes[index].content;
    }, [ index, quotes ]); */

    const memorizedCurrentTime = useMemo(() => {
        return currentTime;
    }, [ currentTime ]);

    const fetchData = url => {
        return fetch(url)
            .then(res => res.json())
    };

    useEffect(() => {
        quoteRef.current.textContent = quotes[index].content;
        quoteAuthorRef.current.textContent = quotes[index].author;
    }, [ index, quotes ]);

    useEffect(() => {
        if(!location.ip || location.ip)
            fetchData(`http://worldtimeapi.org/api/ip/${location.ip}`)
                .then(res => setCurrentTime(t => ({ ...res, date: new Date(res.datetime)})))
                .catch(console.log);
    }, [ location ]);

    const moreHandler = event => {
        homeLocationRef.current.classList.toggle('home__location--display');
        homeIntroRef.current.classList.toggle('home__intro--display');
        homeMoreButtonIcon.current.classList.toggle('home__more-button-icon--rotate');
        homeRef.current.classList.toggle('home--justify-end');
    };

    const getGreetingText = () => {
        let greetingText = "";

        if(memorizedCurrentTime.date) {
            if(memorizedCurrentTime.date.getHours() >= 18) {
                greetingText="Good Evening"
            } else if((memorizedCurrentTime.date.getHours() >= 12) && (memorizedCurrentTime.date.getHours() < 18)) {
                greetingText="Good afternoon"
            } else {
                greetingText="Good Morning"
            }
        } 

        return greetingText;
    };

    const getTime = () => {
        let time = "";

        if(memorizedCurrentTime.date) {
            time = `${memorizedCurrentTime.date.getHours() + 1}:${memorizedCurrentTime.date.getMinutes()}`;
        } 

        return time;
    };

    const getGreetingIconClass = () => {
        let iconClass = "";

        if(memorizedCurrentTime.date) {
            if(memorizedCurrentTime.date.getHours() >= 18) {
                iconClass = "home__greeting--evening";
            }
        }
        
        return iconClass;
    };


    const getBackgroundImageClass = () => {
        let backgroundImageClass = "";

        if(memorizedCurrentTime.date)
            if(memorizedCurrentTime.date.getHours() >= 18) {
                if( window.innerWidth >= 992) 
                    backgroundImageClass = "home--desktop-evening";
                else if( (window.innerWidth >= 501) && (window.innerWidth < 992)) 
                    backgroundImageClass = "home--tablet-evening";
                else
                    backgroundImageClass = "home--evening";
            }
        
        return backgroundImageClass;
    }

    const getHomeAddress = () => {
        let homeAddress = '';

        if(memorizedCurrentTime.timezone) {
            homeAddress = `In ${memorizedCurrentTime.timezone.replace(/[a-z]+\//i, "")}, ${location.country_code}`
        }

        return homeAddress;
    };


    useEffect(() => {
        const controlUserLocalTime = setInterval(() => {
            fetchData('https://freegeoip.app/json/')
                .then(res => setLocation(l => res))
                .catch(console.log);
        }, 10000000);

        fetchData('https://api.quotable.io/quotes?limit=90')
            .then(quotes => {
                setQuotes(q => quotes.results);
                setIndex(i =>  Math.floor(Math.random() * quotes.results.length));
            })
            .catch(console.log);

        fetchData('https://freegeoip.app/json/')
            .then(res => setLocation(l => res))
            .catch(console.log);
        
        return () => { clearInterval(controlUserLocalTime)}
        }, []
    );

    return (
        <main>
            <section
                ref={homeRef}
                className={`align-scretch flex flex-column justify-between width-100 home ${getBackgroundImageClass()}`}>
                <div ref={homeIntroRef} className="flex justify-between width-100 px-5 home__intro">
                    <div className="home__quote-container">
                        <p ref={quoteRef} className="home__quote"></p>
                        <p ref={quoteAuthorRef} className="home__quote-author"></p>
                    </div>
                    <div className="home__refresh-button-container">
                        <button
                            className="border-none outline-none background-transparent block
                            bg-contain no-repeat bg-center home__refresh-button"
                            aria-label="refresh the page to see new quote"
                            onClick={() => setIndex(i =>  Math.floor(Math.random() * quotes.length))}>
                        </button>
                    </div>
                </div>
                <div className="align-start flex flex-column px-5 width-100 home__highlight">
                    <div className="align-start flex flex-column width-100">
                        <p className="align-center flex uppercase home__greeting">
                            <span
                                //ref={homeGreetingIconRef}
                                className={`inline-block bg-contain no-repeat bg-center home__greeting--icon
                                    ${getGreetingIconClass()}`}>
                            </span>
                            { getGreetingText() }
                        </p>
                        <time className="home__time">
                            { getTime() } 
                            <sub className="uppercase home__time--sub">{ memorizedCurrentTime.abbreviation }</sub>
                        </time>
                        <p className="uppercase home__address">
                            { getHomeAddress() }
                        </p>
                    </div>
                    <div>
                        <button className="border-none align-center flex  outline-none uppercase
                            home__more-button"
                            onClick={moreHandler}>
                            More
                            <i
                                ref={homeMoreButtonIcon}
                                className="inline-block bg-contain no-repeat bg-center home__more-button-icon">
                            </i>
                        </button>
                    </div>
                </div>
                <div ref={homeLocationRef} className="align-stretch d-none flex-column justify-between
                    width-100 home__location">
                        <ContentGroup description="Current timezone" value={memorizedCurrentTime.timezone} />
                        <ContentGroup description="Day of the year" value={memorizedCurrentTime.day_of_year} />
                        <ContentGroup description="Day of the week" value={memorizedCurrentTime.day_of_week} />
                        <ContentGroup description="Week number" value={memorizedCurrentTime.week_number} />
                </div>
            </section>
        </main>
    );
};

export default Home;