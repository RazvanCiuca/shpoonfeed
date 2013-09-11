class User < ActiveRecord::Base
  attr_accessible :password, :username
  
  has_many :friendships, :class_name => 'Friendship', :foreign_key => :buddy_id, :dependent => :destroy
  has_many :friends, :through => :friendships, :source => :buddy
  
  
  
  def password=(password)
    self.password_digest = BCrypt::Password.create(password)
  end
  
  def is_correct_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end
  
  def reset_session_token!
    self.session_token = self.class.generate_session_token
    self.save!
  end
  
  def self.find_by_credentials(credentials)
    user = User.find_by_username(credentials[:username])
    
    return nil if user.nil?
    
    user.is_correct_password?(credentials[:password]) ? user : nil
  end
  
end
