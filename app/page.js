"use client";

import React, { useState, useEffect } from 'react';

import AddStudentUyab from './components/addStudentUyab';
import FetchGroup from './components/fetchGroup';

const page = () => {

  useEffect(() => {
    if (localStorage.getItem("url") !== "http://localhost/apiexam/") {
      localStorage.setItem("url", "http://localhost/apiexam/");
    }
  }, []);

  return (
    <>
      <AddStudentUyab />
      {/* <FetchGroup /> */}
    </>
  )
}

export default page
