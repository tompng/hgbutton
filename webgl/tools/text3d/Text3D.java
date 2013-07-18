import java.io.*;
import javax.imageio.*;
import java.awt.image.*;

class Text3D{
  int W,H;
  double[][]map;
  double[][]area;
  double[][]coordsX,coordsY,coordsZ;
  public Text3D(File file)throws Exception{
    BufferedImage img=ImageIO.read(file);
    W=img.getWidth();
    H=img.getHeight();
    map=new double[W][H];
    area=new double[W][H];
    coordsX=new double[W][H];
    coordsY=new double[W][H];
    coordsZ=new double[W][H];
    for(int x=0;x<W;x++)for(int y=0;y<H;y++){
      int c=img.getRGB(x,y);
      area[x][y]=(double)((c>>24)&0xff)/0xff-0.5;
    }
  }
  void initArrays(){
    for(int x=0;x<W;x++)for(int y=0;y<H;y++){
      map[x][y]=area[x][y]>0?1:0;
      coordsX[x][y]=x;
      coordsY[x][y]=y;
      coordsZ[x][y]=map[x][y]>0?1:0;
    }
  }
  void poisson(){
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      double c=area[x][y];
      if(c<0)continue;
      double xm=area[x-1][y],xp=area[x+1][y];
      double ym=area[x][y-1],yp=area[x][y+1];
      double xml,xmz,xpl,xpz,yml,ymz,ypl,ypz;
      double z=map[x][y];
      if(c*xm>0){xml=-1;xmz=map[x-1][y];}
      else{xml=-c/(c-xm);xmz=0;}
      if(c*xp>0){xpl=1;xpz=map[x+1][y];}
      else{xpl=c/(c-xp);xpz=0;}
      if(c*ym>0){yml=-1;ymz=map[x][y-1];}
      else{yml=-c/(c-ym);ymz=0;}
      if(c*yp>0){ypl=1;ypz=map[x][y+1];}
      else{ypl=c/(c-yp);ypz=0;}
      //double dxx/2=(xpz-z)/(xpl-xml)/xpl+(xmz-z)/(xml-xpl)/xml;
      //double dyy/2=(ypz-z)/(ypl-yml)/ypl+(ymz-z)/(yml-ypl)/yml;
      double xma=2/(xml-xpl)/xml;
      double xpa=2/(xpl-xml)/xpl;
      double yma=2/(yml-ypl)/yml;
      double ypa=2/(ypl-yml)/ypl;
      double S=32;
      map[x][y]=(xmz*xma+xpz*xpa+ymz*yma+ypz*ypa+S*S/W/H)/(S*S/W/H+xma+xpa+yma+ypa);
    }
  }

  void poissonEnd(){
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      map[x][y]=Math.sqrt(map[x][y])*W/10;
      coordsZ[x][y]=map[x][y];
    }
  }

  static double mdl(double[][]c,int x,int y,double a){
    return (1-a)*c[x][y]+a*(c[x-1][y]+c[x+1][y]+c[x][y-1]+c[x][y+1])/4;
  }
  double getZ(double x,double y){
    int ix=(int)x,iy=(int)y;
    x-=ix;y-=iy;
    return map[ix][iy]*(1-x)*(1-y)+map[ix+1][iy]*x*(1-y)+map[ix][iy+1]*(1-x)*y+map[ix+1][iy+1]*x*y;
  }
  void copyCoord(double[]out,int x,int y,int dx,int dy){
    double c=area[x][y];
    double c2=area[x+dx][y+dy];
    if(c2>0){
      out[0]=coordsX[x+dx][y+dy];
      out[1]=coordsY[x+dx][y+dy];
      out[2]=coordsZ[x+dx][y+dy];
    }else{
      double d=c/(c-c2);
      out[0]=x+d*dx;
      out[1]=y+d*dy;
      out[2]=0;
    }
  }
  void coords(){
    double[]c1=new double[3],c2=new double[3],c3=new double[3],c4=new double[3];
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      double c=map[x][y];
      if(c<=0)continue;
      copyCoord(c1,x,y,-1,0);
      copyCoord(c2,x,y,+1,0);
      copyCoord(c3,x,y,0,-1);
      copyCoord(c4,x,y,0,+1);
      double cx=(c1[0]+c2[0]+c3[0]+c4[0])/4;
      double cy=(c1[1]+c2[1]+c3[1]+c4[1])/4;
      double cz=(c1[2]+c2[2]+c3[2]+c4[2])/4;
      double xx=coordsX[x][y];
      double yy=coordsY[x][y];
      double zz=coordsZ[x][y];
      double dx=(getZ(xx+1,yy)-getZ(xx-1,yy))/2;
      double dy=(getZ(xx,yy+1)-getZ(xx,yy-1))/2;

      double vx=cx-xx+dx*(cz-zz);
      double vy=cy-yy+dy*(cz-zz);
      double D=(1+dx*dx)*(1+dy*dy)-dx*dx*dy*dy;
      double _x=(vx*(1+dy*dy)-dx*dy*vy)/D;
      double _y=(vy*(1+dx*dx)-dx*dy*vx)/D;

      double dif=(xx-cx)*(xx-cx)+(yy-cy)*(yy-cy)+(zz-cz)*(zz-cz);

      xx+=_x;yy+=_y;
      zz=getZ(xx,yy);
      double dif2=(xx-cx)*(xx-cx)+(yy-cy)*(yy-cy)+(zz-cz)*(zz-cz);

      double rot1=(c1[0]-xx)*(c3[1]-yy)-(c1[1]-yy)*(c3[0]-xx);
      double rot2=(c3[0]-xx)*(c2[1]-yy)-(c3[1]-yy)*(c2[0]-xx);
      double rot3=(c2[0]-xx)*(c4[1]-yy)-(c2[1]-yy)*(c4[0]-xx);
      double rot4=(c4[0]-xx)*(c1[1]-yy)-(c4[1]-yy)*(c1[0]-xx);

      if(dif2<dif&&((rot1<0&&rot2<0&&rot3<0&&rot4<0)||(rot1>0&&rot2>0&&rot3>0&&rot4>0))){
        coordsX[x][y]=xx;
        coordsY[x][y]=yy;
        coordsZ[x][y]=zz;
      }
    }
  }
  void smooth(double a){
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      double c=(area[x-1][y]+area[x+1][y]+area[x][y-1]+area[x][y+1])/4;
      area[x][y]=c*a+(1-a)*area[x][y];
    }
  }
  public static void main(String args[])throws Exception{
    Text3D t=new Text3D(new File("input.png"));
    for(int n=0;n<10;n++){
      t.smooth(0.1);
    }
    t.initArrays();
    for(int n=0;n<1000;n++){
      t.poisson();
    }
    t.poissonEnd();
    for(int n=0;n<1000;n++){
      t.coords();
    }
    t.save(new File("output.png"));
    t.model(2);


    OutputStream out;
    out=new FileOutputStream(new File("output.svg"));
    out.write(t.svgData.toString().getBytes());
    out.close();
    out=new FileOutputStream(new File("output.json"));
    out.write((t.jsonArray.toString()).getBytes());
    out.close();
  }
  static int argb(double a,double r,double g,double b){
    if(a<0)a=0;if(a>1)a=1;
    if(r<0)r=0;if(r>1)r=1;
    if(g<0)g=0;if(g>1)g=1;
    if(b<0)b=0;if(b>1)b=1;
    return ((int)(0xff*a)<<24)|((int)(0xff*r)<<16)|((int)(0xff*g)<<8)|(int)(0xff*b);
  }
  void tri(int x1,int y1,int x2,int y2,int x3,int y3){
    dtri(
      coordsX[x1][y1],coordsY[x1][y1],coordsZ[x1][y1],
      coordsX[x2][y2],coordsY[x2][y2],coordsZ[x2][y2],
      coordsX[x3][y3],coordsY[x3][y3],coordsZ[x3][y3]);
  }
  int P=0,PP=3;
  double transX(double x,double y,double z){
    x-=W/2;y-=H/2;
    double t=Math.PI*P/(PP*PP-1)/2;
    double _y=y,_z=z;
    y=_y*Math.cos(t)-Math.sin(t)*_z;
    z=_y*Math.sin(t)+Math.cos(t)*_z;
    return x/(1+z/H)/PP+W/2/PP+P/PP*W/PP;
  }
  double transY(double x,double y,double z){
    x-=W/2;y-=H/2;
    double t=Math.PI*P/(PP*PP-1)/2;
    double _y=y,_z=z;
    y=_y*Math.cos(t)-Math.sin(t)*_z;
    z=_y*Math.sin(t)+Math.cos(t)*_z;
    return y/(1+z/H)/PP+H/2/PP+P%PP*H/PP;
  }
  void dtri(double x1,double y1,double z1,double x2,double y2,double z2,double x3,double y3,double z3){
    int S=1024/W;
    double D=100;
    for(int param=0;param<PP*PP;param++){P=param;
      svgData.append("<polygon points='"+
        (int)(D*transX(x1,y1,z1))*S/D+','+(int)(D*transY(x1,y1,z1))*S/D+' '+
        (int)(D*transX(x2,y2,z2))*S/D+','+(int)(D*transY(x2,y2,z2))*S/D+' '+
        (int)(D*transX(x3,y3,z3))*S/D+','+(int)(D*transY(x3,y3,z3))*S/D+"'/>");
      svgData.append("<polygon points='"+
        (int)(D*transX(x1,y1,-z1))*S/D+','+(int)(D*transY(x1,y1,-z1))*S/D+' '+
        (int)(D*transX(x2,y2,-z2))*S/D+','+(int)(D*transY(x2,y2,-z2))*S/D+' '+
        (int)(D*transX(x3,y3,-z3))*S/D+','+(int)(D*transY(x3,y3,-z3))*S/D+"'/>");
    }
    jsonArray.addLast(
      "[["+f2s(x1/W-0.5)+","+f2s(y1/W-0.5)+","+f2s(z1/W)+"],"+
        "["+f2s(x2/W-0.5)+","+f2s(y2/W-0.5)+","+f2s(z2/W)+"],"+
        "["+f2s(x3/W-0.5)+","+f2s(y3/W-0.5)+","+f2s(z3/W)+"]]");
    jsonArray.addLast(
      "[["+f2s(x1/W-0.5)+","+f2s(y1/W-0.5)+","+f2s(z1/W)+"],"+
        "["+f2s(x3/W-0.5)+","+f2s(y3/W-0.5)+","+f2s(z3/W)+"],"+
        "["+f2s(x2/W-0.5)+","+f2s(y2/W-0.5)+","+f2s(z2/W)+"]]");
  }
  static String f2s(double x){
    int i=(int)Math.round(x*1000);
    String sgn="";
    if(i<0){sgn="-";i=-i;}
    return sgn+i/1000+"."+i/100%10+i/10%10+i%10;
  }

  StringBuffer svgData=null;
  java.util.LinkedList<String> jsonArray=null;

  void model(int n){
    svgData=new StringBuffer();
    jsonArray=new java.util.LinkedList<String>();
    svgData.append("<svg width='1024' height='1024' version='1.1' xmlns='http://www.w3.org/2000/svg'>");
    svgData.append("<g stroke='black' stroke-width='0.1' fill='none'>");
    double xys[][]=new double[3][100];
    for(int x1=0;x1<W-n;x1+=n)for(int y1=0;y1<H-n;y1+=n){
      int x2=x1+n,y2=y1+n;
      boolean a=area[x1][y1]>0;
      boolean b=area[x1][y2]>0;
      boolean c=area[x2][y1]>0;
      boolean d=area[x2][y2]>0;
      if(!a&&!b&&!c&&!d)continue;
      if(a&&b&&c&&d){
        tri(x1,y1,x2,y1,x2,y2);
        tri(x1,y1,x2,y2,x1,y2);
        continue;
      }
      int x=x1,y=y1;
      int xylen=0;
      for(int i=0;i<4;i++){
        int dx=i==0?1:i==2?-1:0;
        int dy=i==1?1:i==3?-1:0;
        if(area[x][y]>0){
          xys[0][xylen]=coordsX[x][y];
          xys[1][xylen]=coordsY[x][y];
          xys[2][xylen]=coordsZ[x][y];
          xylen++;
        }
        for(int j=0;j<n;j++){
          double aa=area[x][y];
          double bb=area[x+dx][y+dy];
          if(aa*bb<=0){
            double dd=aa/(aa-bb);
            xys[0][xylen]=x+dd*dx;
            xys[1][xylen]=y+dd*dy;
            xys[2][xylen]=0;
            xylen++;
           }
          x+=dx;y+=dy;
        }
      }
      for(int i=0;i<xylen-2;i++){
        dtri(
          xys[0][0],xys[1][0],xys[2][0],
          xys[0][i+1],xys[1][i+1],xys[2][i+1],
          xys[0][i+2],xys[1][i+2],xys[2][i+2]);
      }
    }
    svgData.append("</g></svg>");
  }



  void save(File file)throws Exception{
    BufferedImage img=new BufferedImage(W*4,H*4,BufferedImage.TYPE_INT_ARGB);
    double[]coord=new double[3];
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      double alpha=map[x][y]+0.5;
      double x1=coordsX[x+1][y]-coordsX[x-1][y];
      double y1=coordsY[x+1][y]-coordsY[x-1][y];
      double z1=coordsZ[x+1][y]-coordsZ[x-1][y];
      double x2=coordsX[x][y+1]-coordsX[x][y-1];
      double y2=coordsY[x][y+1]-coordsY[x][y-1];
      double z2=coordsZ[x][y+1]-coordsZ[x][y-1];
      boolean xm=map[x-1][y]>0;
      boolean xp=map[x+1][y]>0;
      boolean ym=map[x][y-1]>0;
      boolean yp=map[x][y+1]>0;
      double nx=y1*z2-y2*z1;
      double ny=z1*x2-z2*x1;
      double nz=x1*y2-x2*y1;
      double r=Math.sqrt(nx*nx+ny*ny+nz*nz);
      nx/=r;ny/=r;nz/=r;

      double Z1=map[x][y]/4+0.5;
      double Z2=map[x][y]/16+0.5;
      double Z3=map[x][y]/64+0.5;
      //img.setRGB(x,y,argb(1,Z1,Z2,Z3));
      //img.setRGB(x,y,argb(map[x][y]>0?1:0,nx/2+0.5,ny/2+0.5,nz/2+0.5));
      //if(x%4==0&&y%4==0)
      //img.setRGB(x,y,argb(1,(coordsX[x][y]-x)/8+0.5,(coordsY[x][y]-y)/8+0.5,0));
      if(area[x][y]<0)continue;
      img.setRGB((int)(4*coordsX[x][y]),(int)(4*coordsY[x][y]),0xff000000);
      for(int i=0;i<4;i++){
        int a=i==0?1:i==2?-1:0;
        int b=i==1?1:i==3?-1:0;
        copyCoord(coord,x,y,a,b);
        img.setRGB((int)(4*coord[0]),(int)(4*coord[1]),0xff000000);
      }
    }
    ImageIO.write(img,"png",file);
  }
}
