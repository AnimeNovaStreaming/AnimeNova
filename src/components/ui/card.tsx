export function Card({children,className=""}:{children:any,className?:string}){
  return(
    <div className={`bg-white/5 border border-white/10 rounded-2xl shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({children,className=""}:{children:any,className?:string}){
  return(
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}