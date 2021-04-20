
const Layer1 = () => {
    return (
        <div className="layer-holder">
        </div>
    )
}
const Layer2 = () => {
    return (
        <div className="layer-holder">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12 p-5 text-center">
                        <h2 className="animate__animated animate__fadeInUp  mainheading text-center">January 2020</h2>
                        <h3 className="animate__animated animate__fadeInUp  subheading text-center">New Scientist reports on mysterious illness</h3>
                        <p>
                            New Scientist reports for the first time about 59 cases of a mysterious pneumonia-like illness in China, linked to a wet market in Wuhan. The affected individuals became ill between 12 and 29 December 2019.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Layer3 = () => {
    return (
        <div className="layer-holder">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12 p-5 text-center">
                        <h2 className="animate__animated animate__fadeInUp  mainheading text-center">23 January 2020</h2>
                        <h3 className="animate__animated animate__fadeInUp  subheading text-center">Lockdowns begin</h3>
                        <p>
                        Wuhan is put under a strict lockdown by the Chinese government. All travel in and out of the city is prohibited.                       
                         </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Layer4 = () => {
    return (
        <div className="layer-holder">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12 p-5 text-center">
                        <h2 className="animate__animated animate__fadeInUp  mainheading text-center">February 2020</h2>
                        <h3 className="animate__animated animate__fadeInUp  subheading text-center">The coronavirus makes it to Europe</h3>
                        <p>
                        The first case of coronavirus in Europe is confirmed in France. The UK reports its first case on 31 January.                       
                         </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
const Layer5 = () => {
    return (
        <div className="layer-holder">
            <div className="container">
                <div className="row mt-5">
                    <div className="col-md-12 p-5 text-center">
                        <h2 className="animate__animated animate__fadeInUp  mainheading text-center">21 February 2020</h2>
                        <h3 className="animate__animated animate__fadeInUp  subheading text-center">Europe’s lockdowns begin</h3>
                        <p>
                        Italy records its first coronavirus death and 50,000 people from 10 towns in the north of the country enter lockdown                       
                         </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
const layers = [<Layer1 />, <Layer2 />,<Layer3/>,<Layer4/>,<Layer5/>]
export default layers