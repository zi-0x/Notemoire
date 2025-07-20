import React from 'react'
import Notes from './Notes'

export default function Aienhancement({ showAlert }) {
  return (
    <div>
      <Notes showAI={true} showAlert={showAlert} />
    </div>
  )
}
