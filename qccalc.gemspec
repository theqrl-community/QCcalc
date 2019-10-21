Gem::Specification.new do |s|
  s.name        = 'qccalc'
  s.version     = '0.0.0'
  s.date        = '2010-04-28'
  s.summary     = "Hola!"
  s.description = "A simple hello world gem"
  s.authors     = ["Jack Matier"]
  s.email       = 'self@jackalyst.com'
  s.license       = 'MIT'

  s.files = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r!^(assets|_(includes|layouts|sass)/|(LICENSE|README)((\.(txt|md|markdown)|$)))!i)
  end
end