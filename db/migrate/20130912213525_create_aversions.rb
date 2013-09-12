class CreateAversions < ActiveRecord::Migration
  def change
    create_table :aversions do |t|
      t.string :reference
      t.integer :user_id
      t.string :name

      t.timestamps
    end
  end
end
