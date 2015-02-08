module SessionsHelper
  def current_user
    return nil  if session[:session_token].nil?
    @current_user ||= User.find_by_session_token(session[:session_token])
  end
  
  def logged_in?
    !!current_user
  end
  
  def login!(user)
    user.session_token = SecureRandom.urlsafe_base64(16)
    user.save
    session[:session_token] = user.session_token
  end
  
  def logout!
    current_user.session_token = SecureRandom.urlsafe_base64(16)
    session[:session_token] = nil
  end
end
