import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    const timerRef = useRef(null);
    const homeGreetingIconRef = useRef(null);

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

    const greetingTextRef = useRef(null);
    const getGreetingText = useCallback((hours) => {
        let greetingText = "";

        if(hours >= 18 && hours <= 23) {
            greetingText="Good Evening"
        } else if((hours >= 12) && (hours < 18)) {
            greetingText="Good afternoon"
        } else {
            greetingText="Good Morning"
        }

        greetingTextRef.current.innerHTML = greetingText;
    }, []);

    const timeRef = useRef('a');
    const hourRef = useRef(0);
    useEffect(() => {
        const timer = setInterval(() => {
            let date = new Date();
            timerRef.current.innerHTML = `${date.getHours()}:${date.getMinutes()}`;

            if(homeRef.current) {
                if(hourRef.current !== date.getHours()) {
                    homeRef.current.classList.remove(timeRef.current);
    
                    if((date.getHours() >= 0) && (date.getHours() < 18)) {
                        homeRef.current.classList.add('home--daytime');
                        timeRef.current = 'home--daytime';
                        homeGreetingIconRef.current.classList.remove('home__greeting--evening');
                    } else {
                        homeRef.current.classList.add('home--nighttime');
                        timeRef.current = 'home--nighttime';
                        homeGreetingIconRef.current.classList.add('home__greeting--evening');
                    }
                    getGreetingText(date.getHours());
                    hourRef.current = date.getHours();
                }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [ getGreetingText ]);

    const getHomeAddress = useCallback(() => {
        let homeAddress = '';

        if(memorizedCurrentTime.timezone) {
            homeAddress = `In ${memorizedCurrentTime.timezone.replace(/[a-z]+\//i, "")}, ${location.country_code}`
        }

        return homeAddress;
    }, [ location, memorizedCurrentTime ]);


    useEffect(() => {
        fetchData('https://api.quotable.io/quotes?limit=90')
            .then(quotes => {
                setQuotes(q => quotes.results);
                setIndex(i =>  Math.floor(Math.random() * quotes.results.length));
            })
            .catch(console.log);

        fetchData('https://freegeoip.app/json/')
            .then(res => setLocation(l => res))
            .catch(console.log);
        }, []
    );

    return (
        <main>
            <section
                ref={homeRef}
                className={`align-scretch flex flex-column justify-between width-100 home`}>
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
                                ref={homeGreetingIconRef}
                                className={`inline-block bg-contain no-repeat bg-center home__greeting--icon`}>
                            </span>
                            <span ref={greetingTextRef}></span>
                        </p>
                       <div>
                            <time ref={timerRef} className="home__time">
                            </time>
                            <sub className="uppercase home__time--sub">{ memorizedCurrentTime.abbreviation }</sub>
                       </div>
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