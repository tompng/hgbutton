import java.io.*;
import javax.imageio.*;
import java.awt.image.*;
import javax.imageio.plugins.jpeg.*;
import javax.imageio.spi.*;
import java.util.*;
import javax.imageio.stream.*;
class GenTexture{

  static void saveAsJpeg(BufferedImage img,File file, double quality)throws Exception{
    JPEGImageWriteParam param = new JPEGImageWriteParam(null);
    param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
    param.setCompressionQuality((float)quality);

    IIORegistry registry = IIORegistry.getDefaultInstance();
    Iterator<ImageWriterSpi> services = registry.getServiceProviders(ImageWriterSpi.class,
      new ServiceRegistry.Filter() {   
        @Override
        public boolean filter(Object provider) {
          if (!(provider instanceof ImageWriterSpi)) return false;
          ImageWriterSpi writerSPI = (ImageWriterSpi) provider;
          String[] formatNames = writerSPI.getFormatNames();
          for (int i = 0; i < formatNames.length; i++) {
            if (formatNames[i].equalsIgnoreCase("JPEG"))return true;
          }
          return false;
        }
      },true);

    ImageWriterSpi writerSpi = services.next();
    ImageWriter writer = writerSpi.createWriterInstance();
    writer.setOutput(new FileImageOutputStream(file));
    writer.write(null, new IIOImage(img, null, null), param);
  }

  public static void main(String args[])throws Exception{
    int JSIZE=512;
    BufferedImage jpgtest=new BufferedImage(JSIZE,JSIZE,BufferedImage.TYPE_INT_RGB);
    for(int x=0;x<JSIZE;x++)for(int y=0;y<JSIZE;y++){
      double xx=(double)x/(JSIZE-1);
      double z=1;
      for(int i=0;i<20;i++){
        double a=4+Math.sin(123+456*i+789*i*i);
        double b=100*Math.sin(987+654*i+321*i*i)%1;
        double yy=0.5+b*Math.cos(xx+100*Math.sin(456+789*i+123*i*i));
        yy+=Math.sin(a*xx+789+123*i+456*i*i)/a;
        yy=yy*JSIZE-y;
        z*=yy>1?1:yy<-1?-1:yy;
      }
      int a=(int)Math.round(0xff*(1+z)/2);
      jpgtest.setRGB(x,y,a*0x10101);
    }
    ImageIO.write(jpgtest,"png",new File("a.png"));
    saveAsJpeg(jpgtest,new File("1.jpg"),0.2);
    saveAsJpeg(jpgtest,new File("2.jpg"),0.4);
    saveAsJpeg(jpgtest,new File("3.jpg"),0.6);
    saveAsJpeg(jpgtest,new File("4.jpg"),0.8);
    saveAsJpeg(jpgtest,new File("5.jpg"),1);

    int SIZE=512;
    double scale=1.0/64;
    double[][]map1=make(SIZE,scale);
    double[][]map2=make(SIZE,scale);
    double[][]map3=make(SIZE,scale);
    BufferedImage img=new BufferedImage(SIZE,SIZE,BufferedImage.TYPE_INT_RGB);
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      int r=(int)(0xff*(0.5*map1[x][y]+0.5));r=r<0?0:r>0xff?0xff:r;
      int g=(int)(0xff*(0.5*map2[x][y]+0.5));g=g<0?0:g>0xff?0xff:g;
      int b=(int)(0xff*(0.5*map3[x][y]+0.5));b=b<0?0:b>0xff?0xff:b;
      img.setRGB(x,y,0xff000000|(r<<16)|(g<<8)|b);
    }
    ImageIO.write(img,"png",new File("out1.png"));
    saveAsJpeg(img,new File("out1_10.jpg"),1);
    saveAsJpeg(img,new File("out1_9.jpg"),0.9);
    saveAsJpeg(img,new File("out1_8.jpg"),0.8);
    double[][]map=make(SIZE,scale);
    double[][][]rot=rot(map,SIZE);
    for(int x=0;x<SIZE;x++)for(int y=0;y<SIZE;y++){
      int r=(int)(0xff*(0.5*rot[0][x][y]+0.5));r=r<0?0:r>0xff?0xff:r;
      int g=(int)(0xff*(0.5*rot[1][x][y]+0.5));g=g<0?0:g>0xff?0xff:g;
      int b=(int)(0xff*(0.5*map[x][y]+0.5));b=b<0?0:b>0xff?0xff:b;
      img.setRGB(x,y,0xff000000|(r<<16)|(g<<8)|b);
    }
    ImageIO.write(img,"png",new File("out2.png"));
    saveAsJpeg(img,new File("out2_10.jpg"),1.0);
    saveAsJpeg(img,new File("out2_9.jpg"),0.9);
    saveAsJpeg(img,new File("out2_8.jpg"),0.8);

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
      double z1=zmap[H-x-1][H-y-1];
      double z=z0;
      z=(2*z-1)*(2*z-1);
      z=1-1/(Math.exp(32*(z-0.01)));
      zmap[x][y]=0.5*z+0.4*z1;
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
    saveAsJpeg(img,new File("out3_10.jpg"),1.0);
    saveAsJpeg(img,new File("out3_9.jpg"),0.9);
    saveAsJpeg(img,new File("out3_8.jpg"),0.8);

    for(int x=0;x<W;x++)for(int y=0;y<H;y++){
      int r,g,b;
      r=g=b=(int)(0xff*zmap[x][y]);
      img.setRGB(x,y,(r<<16)|(g<<8)|b);
    }
    saveAsJpeg(img,new File("out4_10.jpg"),1.0);
    saveAsJpeg(img,new File("out4_9.jpg"),0.9);
    saveAsJpeg(img,new File("out4_8.jpg"),0.8);

    BufferedImage nimg=ImageIO.read(new File("out3_9.jpg"));
    int K=5;
    for(int i=0;i<=2*K;i++){
      for(int x=0;x<W;x++)for(int y=0;y<H;y++){
        int c=nimg.getRGB(x,y);
        double dx=2.0*((c&0xff0000)>>16)/0xff-1;
        double dy=2.0*((c&0xff00)>>16)/0xff-1;
        double dz=2.0*(c&0xff)/0xff-1;
        double dr=Math.sqrt(1+dx*dx+dy*dy);
        dx/=dr;dy/=dr;dz/=dr;
        int r,g,b;
        double ax=1.0*(i-K)/K;
        double ay=0.4*i*(i-2*K)/K/K;
        double az=1;
        double ar=Math.sqrt(ax*ax+ay*ay+az*az);
        int d=(int)(0xff*(az*dz+ax*dx+ay*dy)/ar);
        r=g=b=d<0?0:d;
        img.setRGB(x,y,(r<<16)|(g<<8)|b);
      }
      saveAsJpeg(img,new File("out5-"+i+".jpg"),1.0);
    }

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
