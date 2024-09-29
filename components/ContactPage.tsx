"use client"
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha"
import { url } from "inspector";


const Contact = () => {
    
    const [captcha, setCaptcha] = useState<string | null>();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
      });
      const [submitted, setSubmitted] = useState(false);
      
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captcha) {
            alert("Please complete the CAPTCHA");
            return;
          }
        
          try {
            const response = await fetch('/api/contactVerify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ captcha })
            });
        
            const textResponse = await response.text(); // Get response as text for debugging
            console.log('API Response:', textResponse);
        
            const data = JSON.parse(textResponse); // Parse the text as JSON
        
            if (data.success) {
              console.log("Form data submitted:", formData);
              setSubmitted(true);
            } else {
              alert("Captcha verification failed! Please try again.");
            }
          } catch (error) {
            console.error("Error verifying CAPTCHA:", error);
          }
        };
        
    return (
        

        
        <div className = "  page-height  text-black flex justify-center bg-primary w-full align-middle "style={{ padding: "2rem" }}>
            
      
      {submitted ? (
        <div className = "  text-5xl flex justify-center mx-auto my-auto ">

        <p >Thank you for your message!</p>
        </div>
      ) : (
        <div className = "  text-2xl flex justify-center mx-auto my-auto ">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
            className = "border rounded-full"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ display: "block", margin: "0.5rem 0", padding: "0.5rem" }}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              className = "border rounded-full"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ display: "block", margin: "0.5rem 0", padding: "0.5rem" }}
            />
          </div>
          <div className = "mb-5 rounded-full">
            <label htmlFor="message">Message:</label>
            <textarea
            className ="rounded-md"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              style={{ display: "block", margin: "0.5rem 0", padding: "0.5rem" }}
            />
          </div>
          <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} onChange={(token) => setCaptcha(token)}/>
          
          
          <button className = "border bg-white "type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Submit
          </button>
        </form>
        </div>
      )}
    </div>
  );
};
        
    


export default Contact 