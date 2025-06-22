import React from 'react'
import '../Loading.css'

const Loading = () => {
  return (
    <div class="loader-container">
        <div class="typewriter">
        <div class="slide"><i></i></div>
        <div class="paper"></div>
        <div class="keyboard"></div>
        </div>
    </div>
  )
}

export default Loading