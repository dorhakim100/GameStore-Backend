import profile1 from '../../../Profiles-SVG/1.svg'
import profile2 from '../../../Profiles-SVG/2.svg'
import '../css/AboutTeam.css'

export function AboutTeam() {
  return (
    <div className='about-team-container'>
      <div className='profile-container'>
        <h3>Me</h3>
        <img src={profile1} alt='' />
      </div>
      <div className='profile-container'>
        <h3>Him</h3>
        <img src={profile2} alt='' />
      </div>
    </div>
  )
}
