export default function Logo(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center"}}>
      <div style={{
        width:40,
        height:40,
        borderRadius:12,
        background:"linear-gradient(45deg,orange,pink)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        color:"white",
        fontWeight:"bold"
      }}>
        A
      </div>
      <h2>AnimeNova</h2>
    </div>
  );
}