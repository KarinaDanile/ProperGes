
import Slider from "react-slick";

export default function ImageSlider({ images }) {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <Slider {...settings}>
            {images.map((imageObj, index) => (
                <div key={index}>
                    <div className="w-auto h-96"
                        style={ {backgroundImage: `url(${imageObj.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } }
                    ></div>
                </div>
            ))}
        </Slider>
    );
    
}