class DNA {
  constructor(genes) {
    this._genes = genes;
  }

  crossover(partner) {
    let mid = floor(random(this._genes.length));
    return new DNA([...this._genes.slice(0, mid), ...partner._genes.slice(mid)]);
  }

  mutate(chance) {
    for (let i=0; i<this._genes.length; i++) 
      if (random(1) < chance)
        this._genes[i] = p5.Vector.random2D();
  }
}

DNA.generateGenes = span => Array.from({ length: span }, (_) => p5.Vector.random2D());