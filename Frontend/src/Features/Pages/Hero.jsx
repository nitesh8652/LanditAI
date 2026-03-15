import React from 'react'
import { CTASection } from '@/Features/Components/Ui/hero-dithering-card'
import { useState, useEffect, useRef } from "react";
import Navbar from '../Components/Ui/Navbar';


function Hero() {


    return (
        <>
            <Navbar />
            <CTASection />

        </>
    );
}
export default Hero