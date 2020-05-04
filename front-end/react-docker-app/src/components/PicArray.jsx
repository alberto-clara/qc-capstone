import React from 'react';
import pic1 from '../home_images/image1.jpg';
import pic2 from '../home_images/image2.jpg';
import pic3 from '../home_images/image3.jpg';
import pic4 from '../home_images/image4.jpg';
import pic5 from '../home_images/image5.jpg';
import pic6 from '../home_images/image6.jpg';
import pic7 from '../home_images/image7.jpg';
import pic8 from '../home_images/image8.jpg';
import pic9 from '../home_images/image9.jpg';
import pic10 from '../home_images/image10.jpg';
import pic11 from '../home_images/image11.jpg';
import pic12 from '../home_images/image12.jpg';
import pic13 from '../home_images/image13.jpg';
import pic14 from '../home_images/image14.jpg';
import pic15 from '../home_images/image15.jpg';
import pic16 from '../home_images/image16.jpg';

function display_image () {
    const imagesArray = [pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9, pic10, pic10, pic11, pic12, pic13, pic14, pic15, pic16];
    var num = Math.floor(Math.random() * 16); // 0...6
    var image = imagesArray[num];
    return(
        <img src={image}alt="pic"/>
    );
}

export default display_image;