import React from 'react'

type WarningAlertProps = {
  title: string
  description?: string
}

function WarningAlert(props: WarningAlertProps) {
  const { title, description } = props
  return (
    <div className='w-full p-2 flex text-amber-400 items-center mb-2 border-l-4 border-amber-400'>
      <span className='text-3xl mr-4'>
        ⚠️
      </span>
      <div>
        <h4>{title}</h4>
        {description && <p className='text-xs'>{description}</p>}
      </div>
    </div>
  )
}

export default WarningAlert