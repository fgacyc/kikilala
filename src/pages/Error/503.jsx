import "./style.css"

export default function Error503() {
    return (
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">503</h1>


                            </div>

                            <div className="contant_box_404 p-2">
                                <h3 className="text-2xl h2 mb-2">
                                    We're doing some maintenance
                                </h3>

                                <p>The page you're looking for is currently under maintenance. Please check back
                                    later!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}