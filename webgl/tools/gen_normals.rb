require 'json';

input = STDIN.read

triangles = JSON.parse(input).reject{|p1,p2,p3|p1==p2||p2==p3||p3==p1}

triangles.each{|tri|tri.each{|p|p[2]*=-1;}}

coords_normals = {}


triangles.each do |p1, p2, p3|
  x1,y1,z1=3.times.map{|i|p2[i]-p1[i]}
  x2,y2,z2=3.times.map{|i|p3[i]-p1[i]}

  x=y1*z2-y2*z1
  y=z1*x2-z2*x1
  z=x1*y2-x2*y1
  r=Math.sqrt x*x+y*y+z*z

  [p1,p2,p3].each do |p|
    normal = coords_normals[p] = [0,0,0]
    normal[0]+=x/r
    normal[1]+=y/r
    normal[2]+=z/r
  end
end

coords_normals.each do |key, value|
  x,y,z=value
  r=Math.sqrt x*x+y*y+z*z
  3.times{|i|value[i]/=r}
end

puts({
  length: 3*triangles.size,
  coords: triangles.flatten,
  normals: triangles.flatten(1).map{|p|coords_normals[p]}.flatten.map{|x|(x*1000).round/1000.0}
}.to_json)

