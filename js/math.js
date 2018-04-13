
function rad2Deg(r)
{
    return 180.0 * r / Math.PI;
}

function deg2Rad(d)
{
    return Math.PI * d / 180.0;
}

function clamp(max, min, value)
{
    var result = (value < min) ? min : value; 
    result = (value > max) ? max : value;

    return result;
}

// ---------------------------------------------------------------------------------------
//
//  Vector 2 Class
//
// ---------------------------------------------------------------------------------------
function Vector2(x = 0, y = 0) 
{
    this.x = x;
    this.y = y;
}

Vector2.prototype.add = function(vector)
{
    this.x += vector.x;
    this.y += vector.y;
};

Vector2.prototype.Add = function(vector)
{
    return new Vector2(this.x + vector.x, this.y + vector.y);
};

Vector2.prototype.sub = function(vector)
{
    this.x -= vector.x;
    this.y -= vector.y;
};

Vector2.prototype.Sub = function(vector)
{
    return new Vector2(this.x - vector.x, this.y - vector.y);
}

Vector2.prototype.mult = function(scalar)
{
    this.x *= scalar;
    this.y *= scalar;
};

Vector2.prototype.Mult = function(scalar)
{
    return new Vector2(this.x * scalar, this.y * scalar);
}

Vector2.prototype.normalize = function()
{
  var length = this.length();

  if (length)
    return new Vector2(this.x/length, this.y/length);
  else
    return new Vector2(this.x, this.y);
}

Vector2.prototype.squareMagnitude = function()
{
  return this.x * this.x + this.y * this.y;
}

Vector2.prototype.length = function()
{
  return Math.sqrt(this.squareMagnitude());
}

Vector2.prototype.dot = function (vector)
{
  return this.x * vector.x + this.y * vector.y;
}

Vector2.prototype.perpendicular = function ()
{
  return new Vector2(-this.y, this.x);
}

Vector2.prototype.clear = function()
{
  this.x = 0;
  this.y = 0;
};

Vector2.prototype.copy = function()
{
  return new Vector2(this.x, this.y);
};

// -------------------------------------------------------------------------------------------------
//
//  Vector 3 Class
//
// -------------------------------------------------------------------------------------------------
function Vector3(x, y, z) 
{
  this.x = x;
  this.y = y;
  this.z = z;
}

Vector3.prototype.add = function (vector) 
{
  this.x += vector.x;
  this.y += vector.y;
  this.z += vector.z;
};

Vector3.prototype.Add = function (vector)
{
    return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
};

Vector3.prototype.sub = function (vector) 
{
  this.x -= vector.x;
  this.y -= vector.y;
  this.z -= vector.z;
};

Vector3.prototype.Sub = function (vector)
{
    return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
}

Vector3.prototype.mult = function (scalar)
{
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
}

Vector3.prototype.Mult = function (scalar) 
{
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
};

Vector3.prototype.normalize = function()
{
  var length = this.length();

  if (length)
    return new Vector3(this.x/length, this.y/length, this.z/length);
  else
    return new Vector3(this.x, this.y, this.z);
}

Vector3.prototype.squareMagnitude = function()
{
    return this.x * this.x + this.y * this.y + this.z * this.z;
}

Vector3.prototype.length = function()
{
    return Math.sqrt(this.squareMagnitude());
}

Vector3.prototype.dot = function (vector)
{
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
}

Vector3.prototype.cross = function (vector)
{
    var v = new Vector3();

    v.x = this.y * vector.z - this.z * vector.y;
    v.y = this.z * vector.x - this.x * vector.z;
    v.z = this.x * vector.y - this.y * vector.x;

    return v;
}

Vector3.prototype.clear = function () 
{
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

Vector3.prototype.copy = function () 
{
    return new Vector3(this.x, this.y, this.z);
};

// -------------------------------------------------------------------------------------------------
//
//  Matrix 2 Class
//
// -------------------------------------------------------------------------------------------------
function Matrix2()
{
    this.columns = [new Vector2(1, 0), new Vector2(0, 1)];
}

function Matrix2(angle)
{
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    this.columns = [new Vector2(cos, sin), new Vector2(-sin, cos)];
}

Matrix2.prototype.transpose = function ()
{
    return [new Vector2(this.columns[0].x, this.columns[1].x), new Vector2(this.columns[0].y, this.columns[1].y)];
};

Matrix2.prototype.mult = function (vector)
{
    var rows = this.transpose();
    var newX = rows[0].dot(vector);
    var newY = rows[1].dot(vector);
    vector.x = newX;
    vector.y = newY;
};
