class AversionsController < ApplicationController
  include ApplicationHelper
  def create
    @aversion = Aversion.new(:reference => params[:reference], :user_id => current_user.id)
    if @aversion.save
      render :json => @aversion
    else
      render :json => @aversion
    end
  end
  
  def index
    @user_ids = params[:party] || []
    @user_ids += [current_user.id] 
    @banlist = []
    @user_ids.each do |user_id|
      user = User.find_by_id(user_id)
      user.aversions.each do |aversion|
        @banlist << aversion.reference
      end      
    end
    render :json => @banlist
  end
end
