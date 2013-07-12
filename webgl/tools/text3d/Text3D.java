import java.io.*;
import javax.imageio.*;
import java.awt.image.*;

class Text3D{
  int W,H;
  double[][]map;
  double[][]coordsX,coordsY,coordsZ;
  public Text3D(File file)throws Exception{
    BufferedImage img=ImageIO.read(file);
    W=img.getWidth();
    H=img.getHeight();
    map=new double[W][H];
    coordsX=new double[W][H];
    coordsY=new double[W][H];
    coordsZ=new double[W][H];
    for(int x=0;x<W;x++)for(int y=0;y<H;y++){
      int c=img.getRGB(x,y);
      map[x][y]=(double)((c>>24)&0xff)/0xff-0.5;
      map[x][y]=map[x][y]>0?1:0;
      coordsX[x][y]=x;
      coordsY[x][y]=y;
      coordsZ[x][y]=map[x][y]>0?1:0;
    }
  }
  void poisson(){
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      if(map[x][y]==0)continue;
      map[x][y]=1+(map[x-1][y]+map[x+1][y]+map[x][y-1]+map[x][y+1])/4;
    }
  }
  void poissonEnd(){
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      map[x][y]=Math.sqrt(map[x][y]);
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
  void coords(){
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      double c=map[x][y];
      if(c==0)continue;
      double cx=(coordsX[x-1][y]+coordsX[x+1][y]+coordsX[x][y-1]+coordsX[x][y+1])/4;
      double cy=(coordsY[x-1][y]+coordsY[x+1][y]+coordsY[x][y-1]+coordsY[x][y+1])/4;
      double cz=(coordsZ[x-1][y]+coordsZ[x+1][y]+coordsZ[x][y-1]+coordsZ[x][y+1])/4;
      double xx=coordsX[x][y];
      double yy=coordsY[x][y];
      double zz=coordsZ[x][y];
      double dx=(getZ(xx+1,yy)-getZ(xx-1,yy))/2;
      double dy=(getZ(xx,yy+1)-getZ(xx,yy-1))/2;

      double dif=(xx-cx)*(xx-cx)+(yy-cy)*(yy-cy)+(zz-cz)*(zz-cz);

      double _x=(cx-xx+dx*(cz-zz))/(dx*dx+1);
      double _y=(cy-yy+dy*(cz-zz))/(dy*dy+1);
      xx+=_x/2;yy+=_y/2;
      zz=getZ(xx,yy);
      double dif2=(xx-cx)*(xx-cx)+(yy-cy)*(yy-cy)+(zz-cz)*(zz-cz);
      if(dif2<dif){
      coordsX[x][y]=xx;
      coordsY[x][y]=yy;
      coordsZ[x][y]=zz;
      }
    }
  }
void smooth(){
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      double c=map[x][y];
      if(c<=0)continue;
      boolean xm=map[x-1][y]>0;
      boolean xp=map[x+1][y]>0;
      boolean ym=map[x][y-1]>0;
      boolean yp=map[x][y+1]>0;
      if(xm&&xp&&ym&&yp){
        coordsX[x][y]=mdl(coordsX,x,y,0.05);
        coordsY[x][y]=mdl(coordsY,x,y,0.05);
        coordsZ[x][y]=mdl(coordsZ,x,y,0.05);
      }else{
        double vx=0,vy=0,vz=0;
        int n=(xm?1:0)+(xp?1:0)+(ym?1:0)+(yp?1:0);
        coordsX[x][y]=(
          (xm?coordsX[x-1][y]:0)+(xp?coordsX[x+1][y]:0)+
          (ym?coordsX[x][y-1]:0)+(yp?coordsX[x][y+1]:0)
        )/n;
        coordsY[x][y]=(
          (xm?coordsY[x-1][y]:0)+(xp?coordsY[x+1][y]:0)+
          (ym?coordsY[x][y-1]:0)+(yp?coordsY[x][y+1]:0)
        )/n;
        coordsZ[x][y]=0;
      }
    }
  }
  public static void main(String args[])throws Exception{
    Text3D t=new Text3D(new File("input.png"));
    for(int n=0;n<1000;n++){
      t.poisson();
    }
    t.poissonEnd();
    for(int n=0;n<1000;n++){
      t.coords();
    }
    for(int n=0;n<1000;n++){
      t.smooth();
    }
    t.save(new File("output.png"));
  }
  static int argb(double a,double r,double g,double b){
    if(a<0)a=0;if(a>1)a=1;
    if(r<0)r=0;if(r>1)r=1;
    if(g<0)g=0;if(g>1)g=1;
    if(b<0)b=0;if(b>1)b=1;
    return ((int)(0xff*a)<<24)|((int)(0xff*r)<<16)|((int)(0xff*g)<<8)|(int)(0xff*b);
  }
  void save(File file)throws Exception{
    BufferedImage img=new BufferedImage(W,H,BufferedImage.TYPE_INT_ARGB);
    for(int x=1;x<W-1;x++)for(int y=1;y<H-1;y++){
      double alpha=map[x][y]+0.5;
      double x1=coordsX[x+1][y]-coordsX[x-1][y];
      double y1=coordsY[x+1][y]-coordsY[x-1][y];
      double z1=coordsZ[x+1][y]-coordsZ[x-1][y];
      double x2=coordsX[x][y+1]-coordsX[x][y-1];
      double y2=coordsY[x][y+1]-coordsY[x][y-1];
      double z2=coordsZ[x][y+1]-coordsZ[x][y-1];
      double nx=y1*z2-y2*z1;
      double ny=z1*x2-z2*x1;
      double nz=x1*y2-x2*y1;
      double r=Math.sqrt(nx*nx+ny*ny+nz*nz);
      nx/=r;ny/=r;nz/=r;
      img.setRGB(x,y,argb(map[x][y]>0?1:0,nx/2+0.5,ny/2+0.5,nz/2+0.5));
      //img.setRGB(x,y,argb(1,(coordsX[x][y]-x)/8+0.5,(coordsY[x][y]-y)/8+0.5,0));
      //img.setRGB((int)coordsX[x][y],(int)coordsY[x][y],argb(map[x][y]>0?1:0,(coordsX[x][y]-x)/8+0.5,(coordsY[x][y]-y)/8+0.5,0));
    }
    ImageIO.write(img,"png",new File("o.png"));
    img=new BufferedImage(1024,1024,img.TYPE_INT_ARGB);
    for(int x=0;x<W;x++){
      int y=H/2;


      int xx=(int)(coordsX[x][y]*1024/W);
      int yy=(int)(coordsZ[x][y]*4*1024/W);
      //System.out.println(xx+","+yy);
      if(yy<0)yy=0;if(yy>=1024)yy=1024-1;
      for(int i=-3;i<=3;i++)for(int j=-3;j<=3;j++)
      try{img.setRGB(xx+i,yy+j,0xff000000);}catch(Exception e){}

    }
    ImageIO.write(img,"png",file);
  }
}
