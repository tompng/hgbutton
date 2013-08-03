import java.io.*;
import javax.imageio.*;
import java.awt.image.*;

class Margin{public static void main(String args[])throws Exception{
  BufferedImage img=ImageIO.read(new File(args[0]));
  int W=img.getWidth(),H=img.getHeight();
  double[][]map=new double[W][H];
  double[][]out=new double[W][H];
  for(int x=0;x<W;x++)for(int y=0;y<H;y++)map[x][y]=(double)((img.getRGB(x,y)>>24)&0xff)/0xff;
  for(int x=0;x<W;x++)for(int y=0;y<H;y++)map[x][y]=Math.max(0,(map[x][y]-0.2)/0.8);
  double margin=5.6;
  int m=(int)(margin+2);
  for(int x=0;x<W;x++)for(int y=0;y<H;y++){
    double max=0;
    for(int ix=-m;ix<=m;ix++)for(int iy=-m;iy<=m;iy++){
      if(x+ix<0||x+ix>=W||y+iy<0||y+iy>=H)continue;
      double r=Math.sqrt(ix*ix+iy*iy);
      double val=(margin+0.25-r)*2;
      if(val<0)val=0;
      val*=map[x+ix][y+iy];
      if(max<val)max=val;
    }
    if(max>1)max=1;
    out[x][y]=max;
  }
  img=new BufferedImage(W,H,img.TYPE_INT_RGB);
  for(int x=0;x<W;x++)for(int y=0;y<H;y++){
    int a=(int)Math.round(0xff*out[x][y]);
    int b=(int)Math.round(0xff*map[x][y]);
    img.setRGB(x,y,(b<<16)|(a<<8)|(a*(0xff-b)/0xff));
  }
  ImageIO.write(img,"png",new File(args[1]));

}}
