import java.io.*;
import javax.imageio.*;
import java.awt.image.*;
class GenTexture{
  public static void main(String args[])throws Exception{
    int SIZE=512;
    double scale=1.0/64;
    double[][]map1=make(SIZE,scale);
    double[][]map2=make(SIZE,scale);
    double[][]map3=make(SIZE,scale);
    BufferedImage img=new BufferedImage(SIZE,SIZE,BufferedImage.TYPE_INT_ARGB);
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      int r=(int)(0xff*(0.5*map1[x][y]+0.5));r=r<0?0:r>0xff?0xff:r;
      int g=(int)(0xff*(0.5*map2[x][y]+0.5));g=g<0?0:g>0xff?0xff:g;
      int b=(int)(0xff*(0.5*map3[x][y]+0.5));b=b<0?0:b>0xff?0xff:b;
      img.setRGB(x,y,0xff000000|(r<<16)|(g<<8)|b);
    }
    ImageIO.write(img,"png",new File("out1.png"));
    double[][]map=make(SIZE,scale);
    double[][][]rot=rot(map,SIZE);
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      int r=(int)(0xff*(0.5*rot[0][x][y]+0.5));r=r<0?0:r>0xff?0xff:r;
      int g=(int)(0xff*(0.5*rot[1][x][y]+0.5));g=g<0?0:g>0xff?0xff:g;
      int b=(int)(0xff*(0.5*map[x][y]+0.5));b=b<0?0:b>0xff?0xff:b;
      img.setRGB(x,y,0xff000000|(r<<16)|(g<<8)|b);
    }
    ImageIO.write(img,"png",new File("out2.png"));

    int L=11;
    int H=1<<L;
    int W=H/4;
    double[][][]maps=zlevels(H);
    double zmap[][]=new double[H][H];
    for(int x=0;x<H;x++)for(int y=0;y<H;y++){
      double z=0;
      for(int i=0;i<maps.length-4;i++)z+=maps[i][x][y]*Math.pow(i+1,0.65);
      zmap[x][y]=z;
    }
    normalize01(zmap,H);
    for(int x=0;x<H;x++)for(int y=0;y<H;y++){
      double z0=zmap[x][y];
      double z=z0;
      z=z*z*(3-2*z);
      z=z*z*(3-2*z);
      z=z*z*(3-2*z);
      z=(2*z-1)*(2*z-1);
      zmap[x][y]=0.5*z+0.5*z0;
    }
    normalize01(zmap,H);
    img=new BufferedImage(W,H,BufferedImage.TYPE_INT_RGB);
    for(int x=0;x<W;x++)for(int y=0;y<H;y++){
      double dx=(zmap[(x+1)%H][y]-zmap[(x+H-1)%H][y])*W/10;
      double dy=(zmap[x][(y+1)%H]-zmap[x][(y+H-1)%H])*W/10;
      double dz=1;
      double dr=Math.sqrt(1+dx*dx+dy*dy);
      dx/=dr;dy/=dr;dz/=dr;
      int r=(int)(0xff*(1+dx)/2);
      int g=(int)(0xff*(1+dy)/2);
      int b=(int)(0xff*(1+dz)/2);
      img.setRGB(x,y,(r<<16)|(g<<8)|b);
    }
    ImageIO.write(img,"png",new File("out3.png"));

    for(int x=0;x<W;x++)for(int y=0;y<H;y++){
      int r,g,b;
      r=g=b=(int)(0xff*zmap[x][y]);
      img.setRGB(x,y,(r<<16)|(g<<8)|b);
    }
    ImageIO.write(img,"png",new File("out4.png"));

    for(int x=0;x<W;x++)for(int y=0;y<H;y++){
      double dx=(zmap[(x+1)%H][y]-zmap[(x+H-1)%H][y])*W/10;
      double dy=(zmap[x][(y+1)%H]-zmap[x][(y+H-1)%H])*W/10;
      double dz=1;
      double dr=Math.sqrt(1+dx*dx+dy*dy);
      dx/=dr;dy/=dr;dz/=dr;
      int r,g,b;
      r=g=b=(int)(0xff*(dz));
      img.setRGB(x,y,(r<<16)|(g<<8)|b);
    }
    ImageIO.write(img,"png",new File("out5.png"));

  }

  static double[][][]rot(double[][]map,int SIZE){
    double[][][]out=new double[2][SIZE][SIZE];
    double max=0;
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      double dx=map[(x+1)%SIZE][y]-map[(x+SIZE-1)%SIZE][y];
      double dy=map[x][(y+1)%SIZE]-map[x][(y+SIZE-1)%SIZE];
      out[0][x][y]=dy;
      out[1][x][y]=-dx;
      if(max<Math.abs(dx))max=Math.abs(dx);
      if(max<Math.abs(dy))max=Math.abs(dy);
    }
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      out[0][x][y]/=max;
      out[1][x][y]/=max;
    }
    return out;
  }



  static double[][][] zlevels(int SIZE){
    int level=1;
    while((1<<level)<SIZE)level++;
    double[][][]maps=new double[level][SIZE][SIZE];
    double original[][]=new double[SIZE][SIZE];
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++)original[x][y]=Math.random()-0.5;
    for(int i=0;i<level;i++){
      double[][]map=maps[i];
      for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++)map[x][y]=original[x][y];
      double scale=(double)(1<<i)/SIZE;
      smoothX(map,SIZE,scale);
      transpose(map,SIZE);
      smoothX(map,SIZE,scale);
    }
    return maps;
  }


  static double[][] make(int SIZE, double scale){
    double[][]map=new double[SIZE][SIZE];
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++)map[x][y]=Math.random()-0.5;
    smoothX(map,SIZE,scale);
    transpose(map,SIZE);
    smoothX(map,SIZE,scale);
    normalize(map,SIZE);
    return map;
  }

  static void normalize01(double[][]map,int SIZE){
    double min,max;min=max=map[0][0];
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      if(max<map[x][y])max=map[x][y];
      if(map[x][y]<min)min=map[x][y];
    }
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      map[x][y]=(map[x][y]-min)/(max-min);
    }
  }


  static void normalize(double[][]map,int SIZE){
    double max=0;
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      double z=Math.abs(map[x][y]);
      if(max<z)max=z;
    }
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      map[x][y]=map[x][y]/max;
    }
  }

  static void transpose(double[][]map,int SIZE){
    for(int x=1;x<SIZE;x++){
      for(int y=0;y<x;y++){
        double tmp=map[x][y];
        map[x][y]=map[y][x];
        map[y][x]=tmp;
      }
    }
  }

  static void _smoothX(double[][]map,int SIZE,double scale){
    double line[]=new double[SIZE];
    double S=SIZE*scale;
    for(int y=0;y<SIZE;y++){
      for(int x=0;x<SIZE;x++){
        double sum=0;
        for(int i=-(int)(3*S);i<3*S;i++){
          double w=Math.exp(-i*i/S/S);
          sum+=w*map[((x+i)%SIZE+SIZE)%SIZE][y];
        }
        line[x]=sum;
      }
      for(int x=0;x<SIZE;x++){
        map[x][y]=line[x];
      }
    }
  }

  static void smoothX(double[][]map,int SIZE,double scale){
    double line[]=new double[SIZE];
    double S=SIZE*scale;
    double e=Math.exp(-1/S);
    double e1=e,e2=e1*e,e3=e2*e;
    double E=Math.exp(-SIZE/S);
    double E1=E,E2=E1*E,E3=E2*E;
    for(int y=0;y<SIZE;y++){
      double a1,a2,a3;
      a1=a2=a3=0;
      for(int x=0;x<SIZE;x++){
        double z=map[x][y];
        a1=a1*e1+z;a2=a2*e2+z;a3=a3*e3+z;
      }
      a1/=1-E1;a2/=1-E2;a3/=1-E3;
      for(int x=0;x<SIZE;x++){
        double z=map[x][y];
        a1=a1*e1+z;a2=a2*e2+z;a3=a3*e3+z;
        line[x]=5*a1-4*a2+a3;
      }
      a1=a2=a3=0;
      for(int x=SIZE-1;x>=0;x--){
        double z=map[x][y];
        a1=a1*e1+z;a2=a2*e2+z;a3=a3*e3+z;
      }
      a1/=1-E1;a2/=1-E2;a3/=1-E3;
      for(int x=SIZE-1;x>=0;x--){
        double z=map[x][y];
        a1*=e1;a2*=e2;a3*=e3;
        line[x]+=5*a1-4*a2+a3;
        a1+=z;a2+=z;a3+=z;
      }
      for(int x=0;x<SIZE;x++)map[x][y]=line[x];
    }
  }
}
