import { useState } from 'react'
import { history } from 'umi'

import { useCurrentUser } from '@/requests/index.js'
import { getAllGames, getBalance } from '../../../../flow/scripts'
import { createFlowtokenVault } from '../../../../flow/transactions'

import dayjs from 'dayjs'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper'
import 'swiper/swiper-bundle.css'

import CustomTitle from '@/components/custom-title'
import RectButton from '@/components/rect-button'

import LogoImg from '@/assets/images/logo.png'
import SlogonImg from '@/assets/images/slogon.png'
import RunnerImg from '@/assets/images/runner.png'
import event1Img from '@/assets/images/event1.png'
import event2Img from '@/assets/images/event2.png'
import event3Img from '@/assets/images/event3.png'
import avatarImg from '@/assets/images/avatar.png'
import walletImg from '@/assets/images/wallet.png'

import bloctoIcon from '@/assets/images/blocto.png'
import SearchIcon from '@/assets/icons/search.svg'
import runActivedIcon from '@/assets/icons/runActived.png'
import rideIcon from '@/assets/icons/ride.png'
import moreIcon from '@/assets/icons/more.png'
import closeIcon from '@/assets/icons/close.svg'

import './index.less'
import { useEffect } from 'react'

const events = [
  {
    title: '2020 Boston Marathon',
    banner: event1Img,
    applied: 13506,
    total: 19999,
    status: 'open',
    count: {
      days: 52,
      hours: 23,
      mins: 41,
    },
  },
  {
    title: '2021 Global Marathon',
    banner: event2Img,
    applied: 25971,
    total: 29999,
    status: 'open',
    count: {
      days: 52,
      hours: 23,
      mins: 41,
    },
  },
  {
    title: 'Colour Run',
    banner: event3Img,
    applied: 833,
    total: 999,
    status: 'unopen',
  },
  {
    title: 'Colour Run',
    banner: event3Img,
    applied: 833,
    total: 999,
    status: 'unopen',
  },
  {
    title: '2020 Boston Marathon',
    banner: event1Img,
    applied: 13506,
    total: 19999,
    status: 'open',
    count: {
      days: 52,
      hours: 23,
      mins: 41,
    },
  },
  {
    title: '2021 Global Marathon',
    banner: event2Img,
    applied: 25971,
    total: 29999,
    status: 'open',
    count: {
      days: 52,
      hours: 23,
      mins: 41,
    },
  },
]

export default function IndexPage() {
  const [showMask, setShowMask] = useState(false)
  const [games, setGames] = useState([])
  const [showGames, setShowGames] = useState(false)
  const [userAddr, setUserAddr] = useState('')
  const [balance, setBalance] = useState(null)
  const [showBalance, setShowBalance] = useState(false)
  const [user, addr, logIn, logOut] = useCurrentUser()

  useEffect(async () => {
    const result = await getAllGames()
    const now = Date.now()
    const events = result.splice(-6).reverse().map(event => {
      const obj = {
        ...event,
        days: dayjs.unix(event.timestamp).diff(now, 'days'),
        hours: dayjs.unix(event.timestamp).diff(now, 'hours') % 24,
        mins: dayjs.unix(event.timestamp).diff(now, 'minutes') % 60,
      }
      return obj
    })
    setGames(events)

    if (sessionStorage.getItem('addr')) {
      setUserAddr(sessionStorage.getItem('addr'))
    }
  }, [])

  useEffect(() => {
    games.length > 0 && setShowGames(true)
  }, [games])

  useEffect(() => {
    !!userAddr && sessionStorage.setItem('addr', userAddr)
  }, [userAddr])

  useEffect(() => {
    balance && balance > 0 && setShowBalance(true)
    setTimeout(() => {
      setShowBalance(false)
    }, 10000)
  }, [balance])

  const doLogin = async () => {
    try {
      await logIn()
      setUserAddr(JSON.parse(sessionStorage.CURRENT_USER).addr)
    } catch (err) {
      console.error(err)
    }
  }

  const rememberMe = () => {
    setShowMask(false)
  }

  const getUserBalance = async () => {
    try {
      const result = await getBalance(userAddr)
      setBalance(result)
      console.log('正常获取余额', result)

    } catch (error) {
      await createFlowtokenVault()
      const result = await getBalance(userAddr)
      setBalance(result)
      console.log('重新获取余额', result)
    }
  }

  const truncateAddr = (addr) => {
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`
  }

  const goSign = (uid) => {
    history.push({
      pathname: '/sign',
      search: `?uid=${uid}`,
    })
  }
  
  return (
    <div id='index' className='w-screen flex flex-col items-center relative'>
      {/* header */}
      <div
        id="header-wrapper"
        className='fixed z-10 w-screen h-32 bg-white flex justify-between items-center'
      >
        <div
          id="header"
          className='w-main mx-auto flex justify-between items-center'
        >
          <img src={LogoImg} className='h-14' alt="logo" />
          <div id="search" className='h-14 pl-6 rounded-full flex items-center'>
            <img src={SearchIcon} className='h-6' alt="search" />
            <span className='search-text ml-3'>Search</span>
          </div>
          {!sessionStorage.getItem('addr') && (
            <div
              id="login"
              className='h-14 px-10 py-1.5 flex justify-center items-center border border-solid border-blue rounded-lg text-blue text-xl font-bold leading-none cursor-pointer'
              onClick={() => setShowMask(true)}
            >Log in</div>
          )}
          {sessionStorage.getItem('addr') && (
            <div className='user flex items-center'>
              <img onClick={() => history.push({ pathname: '/index' })} src={avatarImg} className='h-12 cursor-pointer' alt="avatar" />
              <div className='relative h-12 ml-8'>
                <img onClick={getUserBalance} src={walletImg} className='h-12 cursor-pointer' alt="wallet" />
                {showBalance && (
                  <div className='userinfo absolute rounded-lg p-4 bg-white shadow-lg flex flex-col items-center'>
                    <div className="addr text-xl font-bold">{truncateAddr(userAddr)}</div>
                    <div className="balance mt-2 flex items-center">
                      <img src={bloctoIcon} className='w-4 h-4' alt="wallet" />
                      <span className='ml-2 text-gray-500 text-2xl'>{(+balance).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* p1 */}
      <div id="p1" className='pt-44 w-main mx-auto'>
        <img src={SlogonImg} className='w-full' alt="R" />
        <div id="buttons" className='-mt-16 mr-16 flex justify-end items-center'>
          <div className='rect-button w-64'>
            <RectButton btnText={'Explore'} type={'rect'} onClick={() => history.push({ pathname: '/index' })} />
          </div>
          <div className='rect-button w-64 ml-20'>
            <RectButton onClick={() => history.push({ pathname: '/edit-page' })} btnText={'Create games'} type={'rect'} />
          </div>
        </div>
      </div>

      {/* p2 */}
      <div
        id="p2"
        className='w-screen h-screen overflow-hidden'
      >
        <Swiper
          loop={true}
          modules={[Pagination]}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <img
              src={RunnerImg}
              className='slide-img'
              alt="slide"
            />
            <div
              className='race-count-down absolute top-0 right-0 bottom-0 w-1/2 flex flex-col justify-around text-white font-bold'
            >
              <div className='race-name text-7xl'>WuXin Marathon</div>
              <div className="count-down flex gap-x-16">
                <div className='count-down-item flex flex-col items-center'>
                  <span className='value text-7xl'>32</span>
                  <span className='tag mt-1 text-2xl'>days</span>
                </div>
                <div className='count-down-item flex flex-col items-center'>
                  <span className='value text-7xl'>21</span>
                  <span className='tag mt-1 text-2xl'>hours</span>
                </div>
                <div className='count-down-item flex flex-col items-center'>
                  <span className='value text-7xl'>45</span>
                  <span className='tag mt-1 text-2xl'>mins</span>
                </div>
              </div>
              <div className='rect-button w-64 ml-24'>
                <RectButton btnText={'Explore'} type={'rect'} />
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={RunnerImg}
              className='slide-img'
              alt="slide"
            />
            <div
              className='slide-addon absolute top-0 left-0 right-0 bottom-0'
            >

            </div>
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={RunnerImg}
              className='slide-img'
              alt="slide"
            />
            <div
              className='slide-addon absolute top-0 left-0 right-0 bottom-0'
            >

            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* p3 */}
      <div id="p3" className='w-main mx-auto pb-32'>
        <div className='flex'>
          <CustomTitle title={"Popular events"} skew={true} />
        </div>
        <div className="event-types mt-12 flex gap-x-32 items-center">
          <img className='w-20' src={runActivedIcon} alt="run" />
          <img className='w-20' src={rideIcon} alt="ride" />
          <img className='w-16' src={moreIcon} alt="more" />
        </div>
        <div className="mt-20 events flex flex-wrap gap-x-10 gap-y-20">
          {showGames && games.map((game, index) => {
            return <div
              className='event basic-1/3 rounded-2xl overflow-hidden flex flex-col cursor-pointer'
              key={index}
              onClick={() => goSign(game.uid)}
            >
              <img className='event-banner w-full' src={require(`@/assets/images/event${index % 3 + 1}.png`)} alt="banner" />
              <div className="event-intro px-8 py-3 pb-6 flex flex-col flex-grow font-bold">
                <div className="event-title text-2xl">{game.gameName}</div>
                <div className="event-people mt-1">{game.mintedNum} / {game.issues}</div>
                <div className="event-count-down mt-2 flex justify-between items-center">
                  <div className="count-down-item flex flex-col items-center">
                    <div className="value text-2xl leading-none text-blue">{game.days}</div>
                    <div className="tag text-xs">days</div>
                  </div>
                  <div className="count-down-item flex flex-col items-center">
                    <div className="value text-2xl leading-none text-blue">{game.hours}</div>
                    <div className="tag text-xs">hours</div>
                  </div>
                  <div className="count-down-item flex flex-col items-center">
                    <div className="value text-2xl leading-none text-blue">{game.mins}</div>
                    <div className="tag text-xs">mins</div>
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>

      {/* mask */}
      {showMask && (
        <div
          id="mask"
          className='fixed z-20 top-0 bottom-0 left-0 right-0 flex justify-center items-center'
        >
          <div id="popup" className='flex flex-col justify-between items-center bg-white rounded-lg px-7 py-8' onClick={() => { }}>
            <div className="header w-full flex justify-between items-center">
              <div className="placeholder"></div>
              <div className="main text-gray-600 text-4xl leading-none font-bold">Connect wallet</div>
              <img onClick={() => setShowMask(false)} className='mt-1 w-5 cursor-pointer' src={closeIcon} alt="close" />
            </div>
            {!userAddr && (
              <div className="main flex flex-col items-center">
                <div
                  className="button flex items-center gap-x-4 px-12 py-2 border border-solid border-gray-400 rounded-lg cursor-pointer"
                  onClick={doLogin}
                >
                  <img className='w-8' src={bloctoIcon} alt="blocto" />
                  <span className='text-2xl font-bold'>BLOCTO</span>
                </div>
                <div className="no-wallet mt-2 text-xl text-gray-400 underline">I don't have a wallet</div>
                <div className="footer mt-8 flex items-center">
                  <input className='rounded' type="checkbox" defaultChecked name="agree" id="agree" />
                  <span className='ml-2 text-gray-300'>I agree to RaceNumber Terms and Privacy Policy.</span>
                </div>
              </div>
            )}
            {userAddr && (
              <div className="main flex flex-col items-center">
                <div className="px-4 text-lg text-gray-500">Skip approving every interaction with your wallet buy allowing RaceNumber to remember you.</div>
                <div className="mt-6 px-4 py-2 bg-gray-200 text-xl text-gray-500 font-bold">{userAddr}</div>
                <div className='mt-8 rect-button w-56'>
                  <RectButton onClick={rememberMe} btnText={'Remember Me'} type={'rect'} />
                </div>
                <div className="footer mt-8 flex items-center">
                  <div className='px-4 text-sm text-gray-400'>Signing keys can only sign messgaes and cannot hold funds. They are stored securely in the browser database system.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
