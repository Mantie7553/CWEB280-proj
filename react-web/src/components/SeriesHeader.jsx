import Button from "./form-parts/Button.jsx";

export default function SeriesHeader() {
    return (
        <>
            <div>
                <h1>SERIES TITLE</h1>
                <p>SERIES DESCRIPTION</p>
                <div>
                    <div>
                        <p>SERIES TYPE</p>
                        <p>VALUE</p>
                    </div>
                    <div>
                        <p>TOTAL GAMES</p>
                        <p>VALUE</p>
                    </div>
                    <div>
                        <p>DATES</p>
                        <p>VALUE</p>
                    </div>
                    <div>
                        <p>STATUS</p>
                        <p>VALUE</p>
                    </div>
                </div>
                <div>
                    <Button onClick={() => console.log('Edit clicked')} className="btn-secondary" text="EDIT"/>
                    <Button onClick={() => console.log('Add clicked')} className="btn-secondary" text="ADD GAMES"/>
                </div>
            </div>
        </>
    )
}