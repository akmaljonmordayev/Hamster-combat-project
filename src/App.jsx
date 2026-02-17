import React, { useEffect, useState, useRef } from 'react'
import './App.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { GiTwoCoins, GiHammerBreak, GiMining } from 'react-icons/gi'
import { SiBinance } from 'react-icons/si'
import {
  FaUserFriends, FaRocket, FaBatteryFull,
  FaHandPointer, FaParachuteBox, FaTrophy
} from 'react-icons/fa'
import {
  IoFlash, IoSpeedometer, IoCheckmarkCircle,
  IoCloseCircle, IoArrowBack
} from 'react-icons/io5'
import { RiVipCrownFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { AiFillThunderbolt } from 'react-icons/ai'
import {
  BsTwitter, BsYoutube,
  BsMegaphoneFill, BsCalendarCheckFill
} from 'react-icons/bs'
import {
  TbBriefcaseFilled, TbShieldCheckFilled,
  TbSpeakerphone, TbScale
} from 'react-icons/tb'
import { PiCodeBold } from 'react-icons/pi'
import { HiOutlineUsers } from 'react-icons/hi'


const LEVELS = [
  { level: 1, name: 'Bronze', min: 0, max: 5000, color: '#CD7F32' },
  { level: 2, name: 'Silver', min: 5000, max: 25000, color: '#C0C0C0' },
  { level: 3, name: 'Gold', min: 25000, max: 100000, color: '#FFD700' },
  { level: 4, name: 'Platinum', min: 100000, max: 500000, color: '#E2E8F0' },
  { level: 5, name: 'Diamond', min: 500000, max: 2000000, color: '#67E8F9' },
  { level: 6, name: 'Epic', min: 2000000, max: 10000000, color: '#A855F7' },
  { level: 7, name: 'Legendary', min: 10000000, max: 50000000, color: '#F97316' },
  { level: 8, name: 'Master', min: 50000000, max: 200000000, color: '#EF4444' },
  { level: 9, name: 'GrandMaster', min: 200000000, max: 1000000000, color: '#8B5CF6' },
  { level: 10, name: 'Lord', min: 1000000000, max: Infinity, color: '#F59E0B' },
]

const BOOSTS = [
  {
    id: 'multitap', name: 'Multitap',
    desc: "Har bir tapdan ko'proq coin yig'ing",
    Icon: FaHandPointer, color: '#60A5FA',
    levels: [
      { cost: 500, earnPerTap: 2 },
      { cost: 1500, earnPerTap: 4 },
      { cost: 5000, earnPerTap: 8 },
      { cost: 15000, earnPerTap: 16 },
      { cost: 50000, earnPerTap: 32 },
    ],
  },
  {
    id: 'energy_limit', name: 'Energy Limit',
    desc: 'Maksimal energiya limitini oshiring',
    Icon: IoFlash, color: '#FBBF24',
    levels: [
      { cost: 500, energyLimit: 1000 },
      { cost: 1500, energyLimit: 2000 },
      { cost: 5000, energyLimit: 3500 },
      { cost: 15000, energyLimit: 5000 },
      { cost: 50000, energyLimit: 7500 },
    ],
  },
  {
    id: 'recharge_speed', name: 'Recharging Speed',
    desc: 'Energiya tiklanish tezligini oshiring',
    Icon: IoSpeedometer, color: '#34D399',
    levels: [
      { cost: 500, rechargeSpeed: 2 },
      { cost: 1500, rechargeSpeed: 3 },
      { cost: 5000, rechargeSpeed: 5 },
      { cost: 15000, rechargeSpeed: 8 },
      { cost: 50000, rechargeSpeed: 12 },
    ],
  },
]

const FREE_BOOSTS = [
  { id: 'full_energy', name: 'Full Energy', desc: "Energiyani to'liq tiklang", Icon: FaBatteryFull, color: '#34D399', limit: 3 },
  { id: 'turbo', name: 'Turbo', desc: '20 soniya ichida ×5 tap', Icon: FaRocket, color: '#F97316', limit: 3 },
]

const MINE_CARDS = [
  { name: 'CEO', Icon: TbBriefcaseFilled, color: '#60A5FA', cost: 1000, profit: 50 },
  { name: 'Marketing', Icon: TbSpeakerphone, color: '#F472B6', cost: 2000, profit: 100 },
  { name: 'PR', Icon: BsMegaphoneFill, color: '#FBBF24', cost: 3000, profit: 150 },
  { name: 'Legal', Icon: TbScale, color: '#34D399', cost: 5000, profit: 200 },
  { name: 'Dev Team', Icon: PiCodeBold, color: '#A78BFA', cost: 8000, profit: 350 },
  { name: 'Security', Icon: TbShieldCheckFilled, color: '#F87171', cost: 12000, profit: 500 },
]

const EARN_TASKS = [
  { task: "Kanalga obuna bo'ling", reward: 5000, Icon: BsMegaphoneFill, color: '#60A5FA' },
  { task: 'Twitter kuzating', reward: 3000, Icon: BsTwitter, color: '#38BDF8' },
  { task: "YouTube ko'ring", reward: 2500, Icon: BsYoutube, color: '#F87171' },
  { task: 'Kundalik bonus', reward: 1000, Icon: BsCalendarCheckFill, color: '#34D399' },
]

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return Math.floor(n).toString()
}

function Coin({ size = 18 }) {
  return (
    <span className="coin-icon" style={{ width: size, height: size }}>
      <GiTwoCoins size={size * 0.6} color="#78350F" />
    </span>
  )
}

function App() {
  const [coins, setCoins] = useState(0)
  const [energy, setEnergy] = useState(500)
  const [maxEnergy, setMaxEnergy] = useState(500)
  const [earnPerTap, setEarnPerTap] = useState(1)
  const [profitPerHour, setProfitPerHour] = useState(120)
  const [rechargeSpeed, setRechargeSpeed] = useState(1)
  const [activeTab, setActiveTab] = useState('main')
  const [showBoost, setShowBoost] = useState(false)
  const [tapEffects, setTapEffects] = useState([])
  const [turboActive, setTurboActive] = useState(false)
  const [turboTimer, setTurboTimer] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0])
  const [boostLevels, setBoostLevels] = useState({ multitap: 0, energy_limit: 0, recharge_speed: 0 })
  const [freeUsed, setFreeUsed] = useState({ full_energy: 0, turbo: 0 })
  const [hamsterPress, setHamsterPress] = useState(false)

  const turboRef = useRef(false)
  turboRef.current = turboActive
  const tapId = useRef(0)

  useEffect(() => {
    const lvl = LEVELS.find(l => coins >= l.min && coins < l.max) || LEVELS[LEVELS.length - 1]
    setCurrentLevel(lvl)
  }, [coins])

  useEffect(() => {
    const t = setInterval(() => setCoins(p => p + profitPerHour / 3600), 1000)
    return () => clearInterval(t)
  }, [profitPerHour])

  useEffect(() => {
    const t = setInterval(() => setEnergy(p => Math.min(p + rechargeSpeed, maxEnergy)), 1000)
    return () => clearInterval(t)
  }, [rechargeSpeed, maxEnergy])

  useEffect(() => {
    if (!turboActive) return
    if (turboTimer <= 0) { setTurboActive(false); return }
    const t = setTimeout(() => setTurboTimer(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [turboActive, turboTimer])

  const handleTap = (e) => {
    if (energy <= 0 && !turboRef.current) return
    const mul = turboRef.current ? 5 : 1
    const earned = earnPerTap * mul
    setCoins(p => p + earned)
    if (!turboRef.current) setEnergy(p => Math.max(p - earnPerTap, 0))
    setHamsterPress(true)
    setTimeout(() => setHamsterPress(false), 180)
    const rect = e.currentTarget.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    const x = src.clientX - rect.left
    const y = src.clientY - rect.top
    const id = ++tapId.current
    setTapEffects(p => [...p, { id, x, y, value: earned }])
    setTimeout(() => setTapEffects(p => p.filter(t => t.id !== id)), 900)
  }
  const buyBoost = (boostId) => {
    const b = BOOSTS.find(b => b.id === boostId)
    const lvl = boostLevels[boostId]
    if (lvl >= b.levels.length) { toast.error('Maksimal daraja!'); return }
    const next = b.levels[lvl]
    if (coins < next.cost) { toast.error("Yetarli coin yo'q!"); return }
    setCoins(p => p - next.cost)
    setBoostLevels(p => ({ ...p, [boostId]: lvl + 1 }))
    if (boostId === 'multitap') setEarnPerTap(next.earnPerTap)
    if (boostId === 'energy_limit') { setMaxEnergy(next.energyLimit); setEnergy(next.energyLimit) }
    if (boostId === 'recharge_speed') setRechargeSpeed(next.rechargeSpeed)
    toast.success(`${b.name} yaxshilandi!`)
  }
  const useFreeBoost = (boostId) => {
    const b = FREE_BOOSTS.find(b => b.id === boostId)
    const used = freeUsed[boostId]
    if (used >= b.limit) { toast.error('Bugunlik limit tugadi!'); return }
    if (boostId === 'full_energy') { setEnergy(maxEnergy); toast.success("Energiya to'ldirildi!") }
    if (boostId === 'turbo') { setTurboActive(true); setTurboTimer(20); toast.success('TURBO faollashdi! 20s') }
    setFreeUsed(p => ({ ...p, [boostId]: used + 1 }))
  }

  const energyPct = (energy / maxEnergy) * 100
  const levelProgress = Math.min(((coins - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100, 100)

  const NAV = [
    { id: 'exchange', label: 'Exchange', Icon: SiBinance },
    { id: 'mine', label: 'Mine', Icon: GiMining },
    { id: 'main', label: '', Icon: null, center: true },
    { id: 'friends', label: 'Friends', Icon: HiOutlineUsers },
    { id: 'earn', label: 'Earn', Icon: RiMoneyDollarCircleFill },
    { id: 'airdrop', label: 'Airdrop', Icon: FaParachuteBox },
  ]

  return (
    <div className="app">
      <div className="bg-gradient" />
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
      {!showBoost && activeTab === 'main' && (
        <div className="container">
          <h1 className="app-title">Hamster Kombat</h1>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label orange">Earn per tap</span>
              <div className="stat-value">
                <Coin size={15} /><span>+{earnPerTap}</span>
              </div>
            </div>
            <div className="stat-card border-blue">
              <span className="stat-label blue">Coins to level up</span>
              <div className="stat-value">
                <span>{fmt(Math.max(currentLevel.max - coins, 0))}</span>
              </div>
            </div>
            <div className="stat-card border-green">
              <span className="stat-label green">Profit per hour</span>
              <div className="stat-value">
                <Coin size={15} /><span>+{fmt(profitPerHour)}</span>
              </div>
            </div>
            <div className="stat-card border-purple">
              <span className="stat-label purple">Profit per minute</span>
              <div className="stat-value">
                <Coin size={15} /><span>+{(profitPerHour / 60).toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="level-row">
            <RiVipCrownFill size={14} color={currentLevel.color} />
            <span className="level-name" style={{ color: currentLevel.color }}>{currentLevel.name}</span>
            <div className="level-bar-bg">
              <div className="level-bar-fill" style={{ width: `${levelProgress}%`, background: currentLevel.color }} />
            </div>
            <span className="level-num">{currentLevel.level}/10</span>
          </div>

          <div className="coin-display">
            <Coin size={36} />
            <span className="coin-count">{fmt(coins)}</span>
          </div>

          {turboActive && (
            <div className="turbo-badge">
              <FaRocket size={13} /><span>TURBO ×5 — {turboTimer}s</span>
            </div>
          )}

          <div className="hamster-wrapper">
            <div
              className={`hamster-circle${turboActive ? ' turbo' : ''}${hamsterPress ? ' pressed' : ''}`}
              onClick={handleTap}
              onTouchStart={handleTap}
            >
              <div className="hamster-face">
                <div className="ear left-ear" />
                <div className="ear right-ear" />
                <div className="ear-inner left-ear-inner" />
                <div className="ear-inner right-ear-inner" />
                <div className="hamster-head">
                  <div className="eyes-row">
                    <div className="eye"><div className="eye-shine" /></div>
                    <div className="eye"><div className="eye-shine" /></div>
                  </div>
                  <div className="nose" />
                  <div className="cheek left-cheek" />
                  <div className="cheek right-cheek" />
                  <div className="mouth" />
                </div>
                <div className="suit">
                  <div className="tie" />
                </div>
                <div className="arm left-arm" />
                <div className="arm right-arm" />
              </div>

              {tapEffects.map(ef => (
                <div key={ef.id} className="tap-effect" style={{ left: ef.x, top: ef.y }}>
                  +{ef.value}
                </div>
              ))}
            </div>
          </div>

          <div className="energy-section">
            <div className="energy-top">
              <div className="energy-left">
                <IoFlash size={17} color="#FBBF24" />
                <span className="energy-text">{Math.floor(energy)} / {maxEnergy}</span>
              </div>
              <button className="boost-btn" onClick={() => setShowBoost(true)}>
                <AiFillThunderbolt size={14} />
                <span>Boost</span>
              </button>
            </div>
            <div className="energy-bar-bg">
              <div className="energy-bar-fill" style={{ width: `${energyPct}%` }} />
            </div>
          </div>
        </div>
      )}

      {showBoost && (
        <div className="container">
          <div className="boost-header">
            <button className="back-btn" onClick={() => setShowBoost(false)}>
              <IoArrowBack size={18} />
            </button>
            <h1 className="app-title" style={{ margin: 0 }}>Boostlar</h1>
          </div>

          <div className="boost-balance">
            <Coin size={26} />
            <span className="boost-balance-num">{fmt(coins)}</span>
          </div>

          <p className="section-label"><IoFlash size={11} color="#FBBF24" /> Bepul Boostlar (kunlik)</p>
          <div className="boost-list">
            {FREE_BOOSTS.map(b => {
              const used = freeUsed[b.id]
              const remaining = b.limit - used
              return (
                <div key={b.id} className="boost-card">
                  <div className="boost-icon-box" style={{ background: b.color + '22', border: `1px solid ${b.color}44` }}>
                    <b.Icon size={22} color={b.color} />
                  </div>
                  <div className="boost-info">
                    <p className="boost-name">{b.name}</p>
                    <p className="boost-desc">{b.desc}</p>
                    <div className="boost-dots">
                      {[...Array(b.limit)].map((_, i) => (
                        <div key={i} className="dot" style={{ background: i < remaining ? '#FBBF24' : 'rgba(255,255,255,0.12)' }} />
                      ))}
                      <span className="dot-count">{remaining}/{b.limit}</span>
                    </div>
                  </div>
                  <button
                    className="boost-action-btn"
                    style={{ opacity: remaining === 0 ? 0.4 : 1 }}
                    onClick={() => useFreeBoost(b.id)}
                    disabled={remaining === 0}
                  >
                    {remaining === 0 ? 'Tamom' : 'Ishlatish'}
                  </button>
                </div>
              )
            })}
          </div>

          <p className="section-label"><RiMoneyDollarCircleFill size={11} color="#A78BFA" /> Pulli Boostlar</p>
          <div className="boost-list">
            {BOOSTS.map(b => {
              const lvl = boostLevels[b.id]
              const next = b.levels[lvl]
              const maxed = lvl >= b.levels.length
              return (
                <div key={b.id} className="boost-card">
                  <div className="boost-icon-box" style={{ background: b.color + '22', border: `1px solid ${b.color}44` }}>
                    <b.Icon size={22} color={b.color} />
                  </div>
                  <div className="boost-info">
                    <p className="boost-name">{b.name}</p>
                    <p className="boost-desc">{b.desc}</p>
                    {!maxed ? (
                      <div className="boost-cost">
                        <Coin size={11} />
                        <span className="cost-num">{fmt(next.cost)}</span>
                        <span className="cost-level">· Daraja {lvl + 1}</span>
                      </div>
                    ) : (
                      <div className="boost-maxed">
                        <IoCheckmarkCircle size={13} color="#4ADE80" />
                        <span>Maksimal daraja</span>
                      </div>
                    )}
                  </div>
                  <button
                    className="boost-action-btn"
                    style={{ opacity: maxed ? 0.4 : 1 }}
                    onClick={() => buyBoost(b.id)}
                    disabled={maxed}
                  >
                    {maxed ? 'Max' : 'Sotib ol'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!showBoost && activeTab === 'mine' && (
        <div className="container">
          <h1 className="app-title">Mine</h1>
          <p className="tab-subtitle">Bizneslar sotib olib daromadingizni oshiring</p>
          <div className="mine-grid">
            {MINE_CARDS.map(card => (
              <div key={card.name} className="mine-card">
                <div className="mine-icon-box" style={{ background: card.color + '22', border: `1px solid ${card.color}44` }}>
                  <card.Icon size={26} color={card.color} />
                </div>
                <p className="mine-name">{card.name}</p>
                <div className="mine-profit">
                  <IoFlash size={11} color="#4ADE80" />
                  <span>+{card.profit}/h</span>
                </div>
                <button
                  className="mine-btn"
                  onClick={() => {
                    if (coins >= card.cost) {
                      setCoins(p => p - card.cost)
                      setProfitPerHour(p => p + card.profit)
                      toast.success(`${card.name} sotib olindi!`)
                    } else {
                      toast.error("Yetarli coin yo'q!")
                    }
                  }}
                >
                  <Coin size={13} />
                  <span>{fmt(card.cost)}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showBoost && activeTab === 'friends' && (
        <div className="container center-tab">
          <h1 className="app-title">Do'stlar</h1>
          <div className="circle-icon-wrap blue-circle">
            <FaUserFriends size={52} color="#60A5FA" />
          </div>
          <p className="tab-subtitle" style={{ marginTop: 12 }}>
            Do'stlaringizni taklif qiling va bonus oling!
          </p>
          <div className="info-box">
            <div className="info-row">
              <Coin size={20} />
              <span className="yellow-text">5,000 coin — har do'st uchun</span>
            </div>
            <div className="info-row">
              <RiVipCrownFill size={20} color="#A78BFA" />
              <span className="purple-text">25,000 coin — Premium do'st</span>
            </div>
          </div>
          <button className="big-btn">
            <FaUserFriends size={17} />
            <span>Do'stni taklif qilish</span>
          </button>
        </div>
      )}

      {!showBoost && activeTab === 'earn' && (
        <div className="container">
          <h1 className="app-title">Coin Ishlash</h1>
          <div className="earn-list">
            {EARN_TASKS.map(t => (
              <div key={t.task} className="earn-card">
                <div className="mine-icon-box" style={{ background: t.color + '22', border: `1px solid ${t.color}44` }}>
                  <t.Icon size={22} color={t.color} />
                </div>
                <div className="earn-info">
                  <p className="earn-task">{t.task}</p>
                  <div className="earn-reward">
                    <Coin size={12} />
                    <span>+{fmt(t.reward)}</span>
                  </div>
                </div>
                <button
                  className="earn-btn"
                  onClick={() => { setCoins(p => p + t.reward); toast.success(`+${fmt(t.reward)} coin olindi!`) }}
                >
                  Olish
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showBoost && activeTab === 'airdrop' && (
        <div className="container center-tab">
          <h1 className="app-title">Airdrop</h1>
          <div className="circle-icon-wrap purple-circle">
            <FaParachuteBox size={52} color="#A78BFA" />
          </div>
          <h3 className="airdrop-title">HMSTR Token</h3>
          <p className="tab-subtitle">Token listing tayyorlanmoqda. Coinlaringiz tokenga aylantiriladi!</p>
          <div className="info-box" style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 0 }}>
            <div className="airdrop-stat">
              <div className="info-row"><Coin size={18} /><span className="yellow-text">{fmt(Math.floor(coins))}</span></div>
              <span className="airdrop-stat-label">Sizning coin</span>
            </div>
            <div className="divider-v" />
            <div className="airdrop-stat">
              <div className="info-row"><FaTrophy size={18} color="#F59E0B" /><span className="green-text">Tez kunda</span></div>
              <span className="airdrop-stat-label">Listing sanasi</span>
            </div>
          </div>
        </div>
      )}

      {!showBoost && activeTab === 'exchange' && (
        <div className="container center-tab">
          <h1 className="app-title">Exchange</h1>
          <div className="circle-icon-wrap gold-circle">
            <SiBinance size={52} color="#F0B90B" />
          </div>
          <h3 className="airdrop-title">Binance Exchange</h3>
          <p className="tab-subtitle">Exchange tanlang va qo'shimcha bonus oling!</p>
        </div>
      )}

      <nav className="bottom-nav">
        {NAV.map(tab => {
          const active = activeTab === tab.id && !showBoost
          return (
            <button
              key={tab.id}
              className={`nav-btn${active ? ' active' : ''}`}
              onClick={() => { setShowBoost(false); setActiveTab(tab.id) }}
            >
              {tab.center ? (
                <div className={`nav-center-btn${active ? ' active' : ''}`}>
                  <GiHammerBreak size={21} color="#FFF" />
                </div>
              ) : (
                <tab.Icon size={21} color={active ? '#60A5FA' : '#4B5563'} />
              )}
              {tab.label && (
                <span className="nav-label" style={{ color: active ? '#60A5FA' : '#4B5563' }}>
                  {tab.label}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
export default App
