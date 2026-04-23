import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity:1 }}
      exit={{ opacity:0 }}
      transition={{ duration:0.4 }}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'var(--bg-primary)',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        gap:20
      }}>
      <motion.div
        animate={{ scale:[1, 1.12, 1] }}
        transition={{ duration:1.4, repeat:Infinity, ease:'easeInOut' }}
        style={{
          width:48, height:48, background:'var(--accent)',
          borderRadius:10
        }}
      />
      <span style={{ fontWeight:800, fontSize:'1.4rem' }}>CommitWork</span>
      <span style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>
        Loading Protocol...
      </span>
    </motion.div>
  )
}
