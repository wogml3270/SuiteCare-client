import { Fade } from 'react-reveal';

const Footer = ({ data }) => {
  if (!data) return null;

  return (
    <footer>
      <div className='row'>
        <Fade bottom>
          <div className='twelve columns'>
            <ul className='social-links'>
              {data?.social.map((network) => {
                return (
                  <li key={network.name}>
                    <a href={network.url}>
                      <i className={network.className}></i>
                    </a>
                  </li>
                );
              })}
            </ul>

            <ul className='copyright'>
              <li>&copy; Copyright 2021 Nordic Giant</li>
              <li>
                Design by{' '}
                <a title='Styleshout' href='http://www.styleshout.com/'>
                  Styleshout
                </a>
              </li>
            </ul>
          </div>
        </Fade>

        <div id='go-top'>
          <a className='smoothscroll' title='Back to Top' href='#home'>
            <i className='icon-up-open'></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
