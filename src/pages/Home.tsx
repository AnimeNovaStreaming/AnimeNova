import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";

// ======================================================
// CONFIG
// ======================================================
const SITE_NAME = "AnimeNova";
const OWNER_EMAIL = "tristencuthbert09@icloud.com";

// ======================================================
// LOGO
// ======================================================
function Logo(){
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">
        A
      </div>
      <span className="text-2xl font-bold tracking-wide">{SITE_NAME}</span>
    </div>
  );
}

// ======================================================
// MAIN APP
// ======================================================
export default function AnimeStreamingSite(){

  // ---------------- AUTH ----------------
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [isLogin,setIsLogin]=useState(true);

  // ---------------- DATA ----------------
  const [anime,setAnime]=useState([]);
  const [filtered,setFiltered]=useState([]);
  const [search,setSearch]=useState("");
  const [genre,setGenre]=useState("All");

  // ---------------- PLAYER ----------------
  const [current,setCurrent]=useState(null);
  const [watchCounts,setWatchCounts]=useState({});
  const [isPremium,setPremium]=useState(false);

  // ---------------- ADMIN ----------------
  const [title,setTitle]=useState("");
  const [genreInput,setGenreInput]=useState("");
  const [thumbnail,setThumbnail]=useState("");
  const [episodesJSON,setEpisodesJSON]=useState("");


  // ======================================================
  // AUTH LISTENER
  // ======================================================
 useEffect(()=>{
  supabase.auth.getUser().then(res=>{
    setUser(res.data.user);
    setLoading(false);
    if(res.data.user) loadAnime();
  });

  const { data: listener } = supabase.auth.onAuthStateChange((_e,session)=>{
    setUser(session?.user ?? null);
  });

  return ()=>listener.subscription.unsubscribe();
},[]);

  // ======================================================
  // LOAD ANIME
  // ======================================================
  async function loadAnime(){
  const { data,error } = await supabase.from("anime").select("*");
  if(error) return alert(error.message);
  setAnime(data);
  setFiltered(data);
}

  // ======================================================
  // SEARCH FILTER
  // ======================================================
  useEffect(()=>{
    let list = anime.filter(a=>a.title.toLowerCase().includes(search.toLowerCase()));
    if(genre!=="All") list=list.filter(a=>a.genre===genre);
    setFiltered(list);
  },[search,genre,anime]);


  // ======================================================
  // LOGIN / SIGNUP
  // ======================================================
 async function handleAuth(){
  if(isLogin){
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if(error) alert(error.message);
  }else{
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if(error) alert(error.message);
  }
}

  // ======================================================
  // ADD ANIME (OWNER ONLY)
  // ======================================================
  async function addAnime(){
  if(user.email !== import.meta.env.VITE_OWNER_EMAIL)
    return alert("Owner only");

  let parsed;
  try{ parsed = JSON.parse(episodesJSON); }
  catch{ return alert("Invalid JSON"); }

  const { error } = await supabase.from("anime").insert({
    title,
    genre:genreInput,
    thumbnail,
    seasons:parsed
  });

  if(error) return alert(error.message);

  loadAnime();
}

async function logout(){
  await supabase.auth.signOut();
  setUser(null);
}

  // ======================================================
  // PLAY EPISODE
  // ======================================================
  function playEpisode(animeObj,s,e){
    const count = watchCounts[animeObj.title] || 0;

    if(!isPremium && count>=5){
      alert("Free limit reached — upgrade to premium");
      return;
    }

    setCurrent({anime:animeObj,s,e});

    const updated={...watchCounts,[animeObj.title]:count+1};
    setWatchCounts(updated);
  }


  // ======================================================
  // LOADING SCREEN
  // ======================================================
  if(loading)
    return <div className="h-screen flex items-center justify-center text-xl font-bold">Loading...</div>;


  // ======================================================
  // LOGIN PAGE
  // ======================================================
  if(!user){
    return(
      <div className="h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 space-y-4">
            <Logo/>
            <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
            <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
            <Button onClick={handleAuth}>{isLogin?"Login":"Create Account"}</Button>
            <p className="text-sm underline cursor-pointer" onClick={()=>setIsLogin(!isLogin)}>
              {isLogin?"Create account":"Already have account?"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  const genres=["All",...new Set(anime.map(a=>a.genre))];


  // ======================================================
  // MAIN UI
  // ======================================================
  return(
    <div className="p-6 max-w-7xl mx-auto space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <Logo/>
        <div className="flex gap-3">
          <Button onClick={()=>setPremium(true)}>Go Premium</Button>
          <Button variant="outline" onClick={logout}>Logout</Button>
        </div>
      </div>


      {/* SEARCH */}
      <div className="flex gap-3 flex-wrap">
        <Input placeholder="Search anime" value={search} onChange={e=>setSearch(e.target.value)}/>
        <select className="border rounded-xl px-3" value={genre} onChange={e=>setGenre(e.target.value)}>
          {genres.map(g=><option key={g}>{g}</option>)}
        </select>
      </div>


      {/* PLAYER */}
      {current && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h2 className="font-bold">{current.anime.title}</h2>
            <video
              controls
              autoPlay
              src={current.anime.seasons[current.s].episodes[current.e].url}
              className="w-full rounded-xl"
            />
          </CardContent>
        </Card>
      )}


      {/* ADMIN PANEL */}
      {user.email===OWNER_EMAIL && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="font-bold">Upload Anime</h2>
            <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
            <Input placeholder="Genre" value={genreInput} onChange={e=>setGenreInput(e.target.value)}/>
            <Input placeholder="Thumbnail URL" value={thumbnail} onChange={e=>setThumbnail(e.target.value)}/>
            <textarea className="w-full border rounded-xl p-2" rows={5} placeholder="Seasons JSON" value={episodesJSON} onChange={e=>setEpisodesJSON(e.target.value)}/>
            <Button onClick={addAnime}>Upload</Button>
          </CardContent>
        </Card>
      )}


      {/* ANIME GRID */}
      <section>
        <h2 className="text-xl font-bold mb-2">Browse</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((a,i)=>(
            <motion.div key={i} whileHover={{scale:1.05}}>
              <Card className="cursor-pointer" onClick={()=>playEpisode(a,0,0)}>
                <img src={a.thumbnail} className="rounded-t-xl h-40 w-full object-cover"/>
                <CardContent className="p-2 text-sm">
                  <div className="font-semibold">{a.title}</div>
                  <div className="opacity-60 text-xs">{a.genre}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
